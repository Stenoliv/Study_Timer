import { Session } from "@/types/session";

export interface StudyItemProps {
  session: Session;
}

export default function StudyItem(props: StudyItemProps) {
  const { session } = props;

  return <div>{session.id}</div>;
}
