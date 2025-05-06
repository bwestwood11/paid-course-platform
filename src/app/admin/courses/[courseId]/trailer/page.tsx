import TrailerEditorPage from '@/components/course-content/edit-trailer'
import { api } from '@/trpc/server'

type Props = {
  params: Promise<{
    courseId: string;
  }>;
};

const TrailerPage = async ({ params }: Props) => {
  const { courseId } = await params;
  const trailer = await api.trailer.getTrailer({ courseId });
  if (!trailer) return <p>Trailer not found</p>;
  return (
    <div>
      <TrailerEditorPage trailer={trailer} />
    </div>
  )
}

export default TrailerPage