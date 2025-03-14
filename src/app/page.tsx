import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { LoginModal } from "@/components/auth/login-modal";
import PageLayout from "@/components/layout/page-layout";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  return (
    <HydrateClient>
      <PageLayout>
        <LoginModal />
      </PageLayout>
    </HydrateClient>
  );
}
