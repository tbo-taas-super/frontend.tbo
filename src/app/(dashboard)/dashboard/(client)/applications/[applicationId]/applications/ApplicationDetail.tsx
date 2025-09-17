import React, { useEffect, useState } from "react";
import { fetchApplicationById } from "@/@core/services/jobService";
import { Application } from "./ApplicationTable"; // Import Application interface
import Link from "next/link";

interface ApplicationDetailProps {
  applicationId: string;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ applicationId }) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await fetchApplicationById(applicationId);
        if (response.status) {
          setApplication(response.application);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (loading) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  if (!application) {
    return <div className="text-center text-red-600 text-lg">Application not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
    
      
      <div className="space-y-8">
        {/* Candidate Details Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Candidate Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Name:</strong> {application.user.name || "Not provided"}</p>
              <p className="text-gray-600"><strong>Email:</strong> {application.user.email || "Not provided"}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {application.user.phone_number || "Not provided"}</p>
            </div>
            {application.user.profile_image && (
              <div className="mt-2">
                <p className="text-gray-600"><strong>Profile Image:</strong></p>
                <img
                  src={application.user.profile_image}
                  alt="Profile"
                  className="max-w-[200px] rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </section>

        {/* Application Details Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Application Details</h2>
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Job Title:</strong> {application.job.title}</p>
            <p className="text-gray-600"><strong>Application Date:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Status:</strong> {application.status}</p>
          </div>
        </section>

        {/* Submitted Documents Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Submitted Documents</h2>
          <div className="space-y-2">
            {application.user.cv_upload ? (
              <p className="text-gray-600">
                <strong>CV:</strong>{" "}
                <a href={application.user.cv_upload} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Download CV
                </a>
              </p>
            ) : (
              <p className="text-gray-600"><strong>CV:</strong> Not provided</p>
            )}
            {application.user.cover_letter_upload ? (
              <p className="text-gray-600">
                <strong>Cover Letter:</strong>{" "}
                <a href={application.user.cover_letter_upload} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Download Cover Letter
                </a>
              </p>
            ) : (
              <p className="text-gray-600"><strong>Cover Letter:</strong> Not provided</p>
            )}
            {application.user.id_upload ? (
              <p className="text-gray-600">
                <strong>ID:</strong>{" "}
                <a href={application.user.id_upload} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View ID
                </a>
              </p>
            ) : (
              <p className="text-gray-600"><strong>ID:</strong> Not provided</p>
            )}
            {application.user.video_url ? (
              <p className="text-gray-600">
                <strong>Intro Video:</strong>{" "}
                <a href={application.user.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Watch Video
                </a>
              </p>
            ) : (
              <p className="text-gray-600"><strong>Intro Video:</strong> Not provided</p>
            )}
            {application.user.work_sample_upload ? (
              <p className="text-gray-600">
                <strong>Work Sample:</strong>{" "}
                <a href={application.user.work_sample_upload} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Download Work Sample
                </a>
              </p>
            ) : (
              <p className="text-gray-600"><strong>Work Sample:</strong> Not provided</p>
            )}
            {application.user.portfolio_link ? (
              <p className="text-gray-600">
                <strong>Portfolio:</strong>{" "}
                <a href={application.user.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Portfolio
                </a>
              </p>
            ) : (
              <p className="text-gray-600"><strong>Portfolio:</strong> Not provided</p>
            )}
          </div>
        </section>

        {/* Project Screenshots Section */}
        {application.user.project_screenshots && application.user.project_screenshots.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Screenshots</h2>
            <div className="flex flex-wrap gap-4">
              {application.user.project_screenshots.map((screenshot: string, index: number) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`Project screenshot ${index + 1}`}
                  height={590}
                  width={600}
                  className="max-w-[50px] rounded-lg shadow-md"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};