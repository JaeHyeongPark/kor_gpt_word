import LoginForm from "@/components/LoginForm";

export default function Login({
  searchParams,
}: {
  searchParams?: { message: string };
}) {
  return <LoginForm searchParams={searchParams} />;
}
