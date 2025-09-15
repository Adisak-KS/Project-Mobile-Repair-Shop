"use client";

import CompanyForm from "@/app/components/forms/CompanyForm";
import { createCompany, listCompany } from "@/app/services/CompanyService";
import {
  showAlertError,
  showAlertSuccess,
  showAlertWarning,
} from "@/app/utils/sweetAlert";
import { validateCreateCompany } from "@/app/utils/validation";
import { useEffect, useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await listCompany();
      setName(response.data.name);
      setAddress(response.data.address);
      setPhone(response.data.phone);
      setEmail(response.data.email);
      setTaxCode(response.data.taxCode);
      console.log(response.data);
    } catch (error: any) {
      console.error("List Company Error: ", error);
    }
  };

  const handleSave = async () => {
    const errorValidate = validateCreateCompany(
      name,
      address,
      phone,
      email,
      taxCode
    );

    if (errorValidate) {
      showAlertWarning(errorValidate);
      return;
    }

    try {
      setIsLoading(true);
      const response = await createCompany(
        name,
        address,
        phone,
        email,
        taxCode
      );

      if (response) {
        showAlertSuccess("บันทึกข้อมูลเรียบร้อย");
      } else {
        showAlertError("บันทึกข้อมูลบริษัท ไม่สำเร็จ");
      }
    } catch (error: any) {
      showAlertError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CompanyForm
      name={name}
      setName={setName}
      address={address}
      setAddress={setAddress}
      phone={phone}
      setPhone={setPhone}
      email={email}
      setEmail={setEmail}
      taxCode={taxCode}
      setTaxCode={setTaxCode}
      isLoading={isLoading}
      handleSave={handleSave}
    />
  );
}
