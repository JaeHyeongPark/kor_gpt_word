import LoginForm from "@/components/LoginForm";

export default function Home({
  searchParams,
}: {
  searchParams?: { message: string };
}) {
  return <LoginForm searchParams={searchParams} />;
}
