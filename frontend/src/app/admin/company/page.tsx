"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CompanyForm from "@/app/components/forms/CompanyForm";
import { createCompany, listCompany } from "@/app/services/CompanyService";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import { validateCreateCompany } from "@/app/utils/validation";

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
    } catch (error: unknown) {
      console.error("List Company Error: ", error);
      toast.error(extractErrorMessage(error));
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
      toast.error(errorValidate);
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
        toast.success("บันทึกข้อมูลเรียบร้อย");
      } else {
        toast.error("บันทึกข้อมูลบริษัท ไม่สำเร็จ");
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
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
