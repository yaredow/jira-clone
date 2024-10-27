type ProjectSettingsPageProps = {
  params: {
    projectId: string;
  };
};

export default function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  return <div>projectId: {params.projectId}</div>;
}
