import Swal from "sweetalert2";

export const showAlertSuccess = (text: string) => {
  Swal.fire({
    icon: "success",
    title: "สำเร็จ",
    timer: 3000,
    text,
    showConfirmButton: false,
  });
};

export const showAlertWarning = (text: string) => {
  Swal.fire({
    icon: "warning",
    title: "คำเตือน",
    text,
  });
};

export const showAlertError = (text: string) => {
  Swal.fire({
    icon: "error",
    title: "ไม่สำเร็จ",
    text,
  });
};

export const showAlertConfirmDelete = async () => {
  const result = await Swal.fire({
    title: "คุณต้องการลบข้อมูล?",
    text: "หากคุณลบ จะไม่สามารถย้อนกลับได้!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    // cancelButtonColor: "#3085d6",
    confirmButtonText: "ลบข้อมูลเลย",
    cancelButtonText: "ยกเลิก",
  });

  if (result.isConfirmed) {
    // กดยืนยัน
    Swal.fire({
      icon: "success",
      title: "ลบข้อมูลสำเร็จ",
      text: "ข้อมูลถูกลบเรียบร้อยแล้ว",
      timer: 3000,
      showConfirmButton: false,
    });
    return true;
  } else {
    // กดยกเลิก
    return false;
  }
};
