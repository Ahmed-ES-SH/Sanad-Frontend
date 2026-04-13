import { UserOrdersPage } from "@/app/_components/_website/_userDashboard";
import { getMyOrders } from "@/app/actions/ordersActions";

export default async function UserDashboardOrders({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;

  const response = await getMyOrders({ page, limit: 10 });

  const { data, meta } = response;
  return <UserOrdersPage data={data} meta={meta} />;
}
