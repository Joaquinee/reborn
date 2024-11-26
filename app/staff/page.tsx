import { getListStaff } from "./staff.actions";
import StaffPage from "./staff.page";

export default async function Staff() {
  const listStaff = await getListStaff();
  return <StaffPage listStaff={listStaff} />;
}
