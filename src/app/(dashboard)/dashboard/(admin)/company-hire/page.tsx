"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Badge,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Star as StarIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { fetchMessages, sendMessage, getAdminRequests } from "@/@core/services/AdminPool";
import { getUserById } from "@/@core/services/user";
import { getSession } from "next-auth/react";

export interface ConversationData {
  id: number;
  jobTitle: string;
  companyName: string;
  clientId: number;
  participants: { id: number; role: string; name: string; avatar?: string; isOnline: boolean }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface MessageData {
  id: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isStarred: boolean;
}

interface User {
  id: number;
  name: string;
  account_type: string;
  profile_image?: string | null;
}

export default function HirePage() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();
  const userCache = useRef<Map<number, User>>(new Map());

  const parseCustomDate = (dateString: string): Date => {
    if (!dateString || typeof dateString !== "string") {
      return new Date();
    }

    const cleanedDateString = dateString
      .replace("st ", " ")
      .replace("nd ", " ")
      .replace("rd ", " ")
      .replace("th ", " ");

    const [dayMonthYear, time] = cleanedDateString.split(",");
    if (!dayMonthYear) return new Date();

    const [day, month, year] = dayMonthYear.trim().split(" ");
    if (!day || !month || !year) return new Date();

    const monthMap: { [key: string]: string } = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    const monthNumber = monthMap[month] || "01";
    const formattedDay = day.padStart(2, "0");

    let hour = "00";
    let minute = "00";
    if (time && time.trim()) {
      const timeParts = time.trim().split(":");
      if (timeParts.length >= 2) {
        [hour, minute] = timeParts.map((num) => num.padStart(2, "0"));
      }
    }

    const isoDateString = `${year}-${monthNumber}-${formattedDay}T${hour}:${minute}:00`;
    const parsedDate = new Date(isoDateString);

    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        const userId = session?.user?.id;
        if (!userId) throw new Error("No user ID found in session");
        const userData = await getUserById(userId);
        if (userData.account_type !== "ADMIN") {
          setToast({ open: true, message: "Access restricted to admin users", severity: "error" });
          router.push("/unauthorized");
          return;
        }
        userCache.current.set(userId, userData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setToast({ open: true, message: "Failed to fetch user data", severity: "error" });
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getAdminRequests();
        const clientConversations: ConversationData[] = [];
        for (const request of data.requests) {
          if (request.client?.id) {
            let clientUser = userCache.current.get(request.client.id);
            if (!clientUser) {
              clientUser = await getUserById(request.client.id);
              userCache.current.set(request.client.id, clientUser);
            }
            if (clientUser.account_type === "CLIENT") {
              const requestMessages = request.messages || [];
              const lastMessage = requestMessages[requestMessages.length - 1];
              clientConversations.push({
                id: request.id,
                jobTitle: request.job_title || "Untitled Job",
                companyName: request.client?.name || "Unknown Client",
                clientId: request.client.id,
                participants: [
                  {
                    id: request.client.id,
                    role: "Client",
                    name: request.client.name || "Unknown",
                    avatar: request.client.company_logo || undefined,
                    isOnline: false,
                  },
                ],
                lastMessage: lastMessage?.message_text || "No messages yet",
                lastMessageTime: lastMessage?.sent_at || request.request_date || "",
                unreadCount: requestMessages.filter((m) => m.receiver_id === user.id && m.status === "sent").length || 0,
              });
            }
          }
        }
        setConversations(clientConversations);
        if (clientConversations.length > 0) setSelectedConversation(clientConversations[0]);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setToast({ open: true, message: "Failed to fetch conversations", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessagesForConversation = async () => {
      if (selectedConversation && user) {
        setLoading(true);
        try {
          const data = await fetchMessages(selectedConversation.id);
          if (isMounted) {
            const mappedMessages: MessageData[] = [];
            for (const msg of data.messages) {
              let isValidMessage = false;
              if (msg.sender_role === "ADMIN" && msg.sender_id === user.id) {
                let receiverUser = userCache.current.get(msg.receiver_id);
                if (!receiverUser) {
                  receiverUser = await getUserById(msg.receiver_id);
                  userCache.current.set(msg.receiver_id, receiverUser);
                }
                if (receiverUser.account_type === "CLIENT") isValidMessage = true;
              } else if (msg.sender_role === "CLIENT" && msg.receiver_id === user.id) {
                let senderUser = userCache.current.get(msg.sender_id);
                if (!senderUser) {
                  senderUser = await getUserById(msg.sender_id);
                  userCache.current.set(msg.sender_id, senderUser);
                }
                if (senderUser.account_type === "CLIENT") isValidMessage = true;
              }
              if (isValidMessage) {
                mappedMessages.push({
                  id: msg.id,
                  senderName: msg.sender_id === user.id ? "You" : msg.sender_name || "Unknown",
                  senderAvatar: msg.sender_id === user.id ? user.profile_image ?? undefined : selectedConversation.participants.find((p) => p.id === msg.sender_id)?.avatar,
                  content: msg.message_text,
                  timestamp: msg.sent_at,
                  isStarred: false,
                });
              }
            }
            setMessages(mappedMessages);
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setToast({ open: true, message: "Failed to fetch messages", severity: "error" });
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    fetchMessagesForConversation();

    return () => {
      isMounted = false;
    };
  }, [selectedConversation?.id, user?.id]);

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation && user) {
      setLoading(true);
      try {
        const receiverId = selectedConversation.clientId;
        let receiverUser = userCache.current.get(receiverId);
        if (!receiverUser) {
          receiverUser = await getUserById(receiverId);
          userCache.current.set(receiverId, receiverUser);
        }
        if (receiverUser.account_type !== "CLIENT") throw new Error("Recipient is not a client user");

        const response = await sendMessage(selectedConversation.id, receiverId, newMessage, null, false);
        const newMsg: MessageData = {
          id: response?.data.id || Date.now(),
          senderName: "You",
          senderAvatar: user.profile_image ?? undefined,
          content: newMessage,
          timestamp: new Date().toISOString(),
          isStarred: false,
        };

        setMessages((prev) => [...prev, newMsg]);
        setNewMessage("");
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? { ...conv, lastMessage: newMsg.content, lastMessageTime: newMsg.timestamp }
              : conv
          )
        );

        setToast({ open: true, message: `Message sent to ${selectedConversation.companyName} successfully`, severity: "success" });
      } catch (error) {
        console.error("Failed to send message:", error);
        setToast({ open: true, message: `Failed to send message`, severity: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  const formatTime = (timestamp: string) => {
    const date = parseCustomDate(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = parseCustomDate(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    else if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    else return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6" color="text.secondary">
          Loading user data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Hiring
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage hiring conversations and communications
        </Typography>
      </Box>

      <Box sx={{ display: "flex", height: "calc(100vh - 200px)", gap: 3 }}>
        <Box sx={{ width: 400, minWidth: 350 }}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, pb: 2 }}>
              <TextField
                placeholder="Search jobs or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>

            <Divider />

            <Box sx={{ flex: 1, overflow: "auto" }}>
              <List sx={{ p: 0 }}>
                {filteredConversations.map((conversation) => {
                  const isSelected = selectedConversation?.id === conversation.id;
                  const client = conversation.participants.find((p) => p.role === "Client");

                  return (
                    <ListItem key={conversation.id} sx={{ p: 0 }}>
                      <ListItemButton
                        onClick={() => setSelectedConversation(conversation)}
                        sx={{
                          p: 3,
                          bgcolor: isSelected ? "action.selected" : "transparent",
                          borderLeft: isSelected ? "3px solid" : "3px solid transparent",
                          borderLeftColor: isSelected ? "primary.main" : "transparent",
                          "&:hover": {
                            bgcolor: isSelected ? "action.selected" : "action.hover",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            variant="dot"
                            sx={{
                              "& .MuiBadge-badge": {
                                backgroundColor: client?.isOnline ? "#44b700" : "#bdbdbd",
                                color: client?.isOnline ? "#44b700" : "#bdbdbd",
                                width: 12,
                                height: 12,
                                border: "2px solid white",
                              },
                            }}
                          >
                            <Avatar src={client?.avatar} sx={{ width: 48, height: 48 }}>
                              {conversation.jobTitle[0]}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>

                        <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: conversation.unreadCount > 0 ? 600 : 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1,
                                mr: 1,
                              }}
                            >
                              {conversation.jobTitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                              {conversation.lastMessageTime ? formatDate(conversation.lastMessageTime) : ""}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1,
                                mr: 1,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              {conversation.companyName}
                            </Typography>
                            {conversation.unreadCount > 0 && (
                              <Chip
                                label={conversation.unreadCount}
                                size="small"
                                sx={{
                                  bgcolor: "#D32F2F",
                                  color: "white",
                                  fontSize: "0.75rem",
                                  height: 22,
                                  minWidth: 22,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                            }}
                          >
                            {conversation.lastMessage}
                          </Typography>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {selectedConversation ? (
              <>
                <Box sx={{ p: 3, borderBottom: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: selectedConversation.participants.find((p) => p.role === "Client")?.isOnline
                              ? "#44b700"
                              : "#bdbdbd",
                            color: selectedConversation.participants.find((p) => p.role === "Client")?.isOnline
                              ? "#44b700"
                              : "#bdbdbd",
                            width: 12,
                            height: 12,
                            border: "2px solid white",
                          },
                        }}
                      >
                        <Avatar
                          src={selectedConversation.participants.find((p) => p.role === "Client")?.avatar}
                          sx={{ width: 48, height: 48 }}
                        >
                          {selectedConversation.jobTitle[0]}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedConversation.jobTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConversation.companyName} •{" "}
                          {selectedConversation.participants.find((p) => p.role === "Client")?.isOnline
                            ? "Online"
                            : "Offline"}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: "auto", p: 3, bgcolor: "#F9FAFB" }}>
                  {messages.map((message, index) => {
                    const isOwnMessage = message.senderName === "You";
                    const showDate =
                      index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

                    return (
                      <Box key={message.id}>
                        {showDate && (
                          <Box sx={{ textAlign: "center", my: 3 }}>
                            <Chip
                              label={formatDate(message.timestamp)}
                              size="small"
                              sx={{
                                bgcolor: "white",
                                color: "text.secondary",
                                fontSize: "0.75rem",
                              }}
                            />
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                            mb: 2,
                            px: 2,
                          }}
                        >
                          <Box sx={{ maxWidth: "60%", minWidth: "25%" }}>
                            {!isOwnMessage && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, ml: 1 }}>
                                <Avatar sx={{ width: 28, height: 28 }} src={message.senderAvatar}>
                                  {message.senderName[0]}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  {message.senderName}
                                </Typography>
                              </Box>
                            )}
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2,
                                bgcolor: isOwnMessage ? "#2979FF" : "white",
                                color: isOwnMessage ? "white" : "text.primary",
                                borderRadius: 10,
                                borderTopRightRadius: isOwnMessage ? 4 : 10,
                                borderTopLeftRadius: isOwnMessage ? 10 : 4,
                                position: "relative",
                                fontSize: "0.95rem",
                                lineHeight: 1.5,
                              }}
                            >
                              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                {message.content}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: isOwnMessage ? "rgba(255,255,255,0.7)" : "text.secondary",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {formatTime(message.timestamp)}
                                </Typography>
                                {message.isStarred && (
                                  <StarIcon
                                    sx={{
                                      fontSize: 16,
                                      color: isOwnMessage ? "rgba(255,255,255,0.7)" : "primary.main",
                                    }}
                                  />
                                )}
                              </Box>
                            </Paper>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                <Box sx={{ p: 3, borderTop: "1px solid #E5E7EB", bgcolor: "white" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                    <TextField
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      size="small"
                      fullWidth
                      multiline
                      maxRows={4}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 8,
                          bgcolor: "#F5F5F5",
                          "& fieldset": { borderWidth: 1 },
                        },
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || loading}
                      sx={{
                        bgcolor: "#2979FF",
                        color: "white",
                        mb: 0.5,
                        "&:hover": {
                          bgcolor: "#1565C0",
                        },
                        "&:disabled": {
                          bgcolor: "grey.300",
                          color: "grey.500",
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 2,
                  p: 4,
                }}
              >
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Select a conversation to start messaging
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", maxWidth: 400 }}>
                  Choose from your existing conversations on the left to view messages and continue the discussion
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}