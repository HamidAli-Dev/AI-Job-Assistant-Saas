import JobDetails from "./job-details";

const RightSidePanel = ({ jobId }: { jobId: string }) => {
  return (
    <div className="flex w-full h-screen overflow-y-auto">
      <div className="w-full">
        {/* {Job Details} */}
        <JobDetails jobId={jobId} />
      </div>
    </div>
  );
};

export default RightSidePanel;
