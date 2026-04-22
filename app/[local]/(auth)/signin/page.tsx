import AuthLayout from "@/app/_components/_website/_auth/AuthLayout";
import SignInForm from "@/app/_components/_website/_auth/SignInForm";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.signInMeta.title,
    description: translations.signInMeta.description,
    ...sharedMetadata,
  };
}

export default function SigninPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
