export interface MessageData {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  receiverId: string
  receiverName: string
  subject: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  attachments?: string[]
}

export interface ConversationData {
  id: string
  participants: {
    id: string
    name: string
    avatar: string
    role: string
    isOnline: boolean
  }[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  jobTitle: string
  companyName: string
  talentName: string
  talentAvatar: string
  messages: MessageData[]
}

export const conversationData: ConversationData[] = [
  {
    id: "CONV001",
    participants: [
      {
        id: "TALENT001",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Talent",
        isOnline: true,
      },
      {
        id: "ADMIN001",
        name: "TBO Admin",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Admin",
        isOnline: true,
      },
    ],
    lastMessage: "Thank you for considering my application. I'm very interested in this position.",
    lastMessageTime: "2 hours ago",
    unreadCount: 2,
    jobTitle: "Senior Software Engineer",
    companyName: "Tech Solutions Inc.",
    talentName: "Sarah Johnson",
    talentAvatar: "/placeholder.svg?height=40&width=40",
    messages: [
      {
        id: "MSG001",
        senderId: "TALENT001",
        senderName: "Sarah Johnson",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        receiverId: "ADMIN001",
        receiverName: "TBO Admin",
        subject: "Application for Senior Software Engineer",
        content:
          "Hi, I'm very interested in the Senior Software Engineer position at Tech Solutions Inc. I have 6+ years of React experience and 3+ years with React Native.",
        timestamp: "2024-03-15T10:30:00Z",
        isRead: true,
        isStarred: false,
      },
      {
        id: "MSG002",
        senderId: "ADMIN001",
        senderName: "TBO Admin",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        receiverId: "TALENT001",
        receiverName: "Sarah Johnson",
        subject: "Re: Application for Senior Software Engineer",
        content:
          "Thank you for your interest, Sarah. Your profile looks impressive. We'd like to schedule an initial screening call with you.",
        timestamp: "2024-03-15T11:15:00Z",
        isRead: true,
        isStarred: false,
      },
      {
        id: "MSG003",
        senderId: "TALENT001",
        senderName: "Sarah Johnson",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        receiverId: "ADMIN001",
        receiverName: "TBO Admin",
        subject: "Re: Screening Call",
        content:
          "That sounds great! I'm available for a call this week. Please let me know what times work best for you.",
        timestamp: "2024-03-15T14:20:00Z",
        isRead: false,
        isStarred: false,
      },
      {
        id: "MSG004",
        senderId: "ADMIN001",
        senderName: "TBO Admin",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        receiverId: "TALENT001",
        receiverName: "Sarah Johnson",
        subject: "Interview Scheduled",
        content:
          "Perfect! I've scheduled your screening call for Thursday at 2 PM. You'll receive a calendar invite shortly.",
        timestamp: "2024-03-15T14:25:00Z",
        isRead: false,
        isStarred: false,
      },
    ],
  },
  {
    id: "CONV002",
    participants: [
      {
        id: "TALENT002",
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Talent",
        isOnline: false,
      },
      {
        id: "ADMIN001",
        name: "TBO Admin",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Admin",
        isOnline: true,
      },
    ],
    lastMessage: "I have some questions about the UX Designer role requirements.",
    lastMessageTime: "1 day ago",
    unreadCount: 1,
    jobTitle: "UX Designer",
    companyName: "Digital Marketing Pro",
    talentName: "Michael Chen",
    talentAvatar: "/placeholder.svg?height=40&width=40",
    messages: [
      {
        id: "MSG005",
        senderId: "TALENT002",
        senderName: "Michael Chen",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        receiverId: "ADMIN001",
        receiverName: "TBO Admin",
        subject: "Questions about UX Designer Role",
        content:
          "Hi! I'm interested in the UX Designer position at Digital Marketing Pro. Could you provide more details about the design tools and methodologies used?",
        timestamp: "2024-03-14T09:00:00Z",
        isRead: false,
        isStarred: true,
      },
    ],
  },
  {
    id: "CONV003",
    participants: [
      {
        id: "TALENT003",
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Talent",
        isOnline: true,
      },
      {
        id: "ADMIN001",
        name: "TBO Admin",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Admin",
        isOnline: true,
      },
    ],
    lastMessage: "Thank you for the interview opportunity. Looking forward to hearing back.",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    jobTitle: "Data Scientist",
    companyName: "Analytics Corp",
    talentName: "Emily Rodriguez",
    talentAvatar: "/placeholder.svg?height=40&width=40",
    messages: [
      {
        id: "MSG006",
        senderId: "ADMIN001",
        senderName: "TBO Admin",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        receiverId: "TALENT003",
        receiverName: "Emily Rodriguez",
        subject: "Interview Completed - Data Scientist",
        content:
          "Hi Emily, thank you for taking the time to interview with Analytics Corp. The team was impressed with your background in machine learning.",
        timestamp: "2024-03-12T16:45:00Z",
        isRead: true,
        isStarred: false,
      },
    ],
  },
  {
    id: "CONV004",
    participants: [
      {
        id: "TALENT004",
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Talent",
        isOnline: false,
      },
      {
        id: "ADMIN001",
        name: "TBO Admin",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Admin",
        isOnline: true,
      },
    ],
    lastMessage: "I'd like to know more about the company culture and team structure.",
    lastMessageTime: "5 days ago",
    unreadCount: 0,
    jobTitle: "Product Manager",
    companyName: "Innovation Labs",
    talentName: "David Kim",
    talentAvatar: "/placeholder.svg?height=40&width=40",
    messages: [
      {
        id: "MSG007",
        senderId: "TALENT004",
        senderName: "David Kim",
        senderAvatar: "/placeholder.svg?height=40&width=40",
        receiverId: "ADMIN001",
        receiverName: "TBO Admin",
        subject: "Product Manager Role Inquiry",
        content:
          "Hi, I'm interested in the Product Manager position at Innovation Labs. Could you tell me more about the team I'd be working with and the company culture?",
        timestamp: "2024-03-10T14:30:00Z",
        isRead: true,
        isStarred: false,
      },
    ],
  },
]
