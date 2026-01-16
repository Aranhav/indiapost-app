"use client";

import { useState } from "react";

type ModalType = "csb4" | "csb5gst" | "csb5lut" | "commercial" | "noncommercial" | null;

interface FormData {
  hasGst: boolean;
  hasLut: boolean;
  adCode: string;
  ieCode: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  lutArn: string;
  lutValidityDate: string;
  gstCertificate: File | null;
  iecCertificate: File | null;
  adCodeCertificate: File | null;
  lutDocument: File | null;
}

interface FormErrors {
  taxType?: string;
  adCode?: string;
  ieCode?: string;
  bankName?: string;
  ifscCode?: string;
  accountNumber?: string;
  lutArn?: string;
  lutValidityDate?: string;
  gstCertificate?: string;
  iecCertificate?: string;
  adCodeCertificate?: string;
  lutDocument?: string;
}

// Non-Commercial Form Data (for individuals without GST)
interface NonCommercialFormData {
  fullName: string;
  panNumber: string;
  aadharNumber: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  panCard: File | null;
  aadharCard: File | null;
}

interface NonCommercialFormErrors {
  fullName?: string;
  panNumber?: string;
  aadharNumber?: string;
  bankName?: string;
  ifscCode?: string;
  accountNumber?: string;
  panCard?: string;
  aadharCard?: string;
}

type OnboardingType = "commercial" | "noncommercial";

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedOnboarding, setSelectedOnboarding] = useState<OnboardingType>("commercial");
  const [formData, setFormData] = useState<FormData>({
    hasGst: true, // Pre-selected GST (fixed)
    hasLut: false,
    adCode: "",
    ieCode: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    lutArn: "",
    lutValidityDate: "",
    gstCertificate: null,
    iecCertificate: null,
    adCodeCertificate: null,
    lutDocument: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  // State for CSB 5 GST form
  const [csb5FormData, setCsb5FormData] = useState<FormData>({
    hasGst: true,
    hasLut: false,
    adCode: "",
    ieCode: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "1234567890123456", // Prefilled but editable
    lutArn: "",
    lutValidityDate: "",
    gstCertificate: null,
    iecCertificate: null,
    adCodeCertificate: null,
    lutDocument: null,
  });
  const [csb5Errors, setCsb5Errors] = useState<FormErrors>({});
  const [csb5Submitted, setCsb5Submitted] = useState(false);

  // State for CSB 5 LUT form
  const [csb5LutFormData, setCsb5LutFormData] = useState<FormData>({
    hasGst: true, // Pre-selected GST (fixed)
    hasLut: true, // Pre-selected LUT (fixed)
    adCode: "",
    ieCode: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "1234567890123456", // Prefilled but editable
    lutArn: "XXXXXXXXXXXXXXXX", // Prefilled LUT ARN
    lutValidityDate: "2025-03-31", // Prefilled validity date
    gstCertificate: null,
    iecCertificate: null,
    adCodeCertificate: null,
    lutDocument: new File([""], "lut_document.pdf", { type: "application/pdf" }), // Pre-uploaded
  });
  const [csb5LutErrors, setCsb5LutErrors] = useState<FormErrors>({});
  const [csb5LutSubmitted, setCsb5LutSubmitted] = useState(false);

  // State for Commercial form
  const [commercialFormData, setCommercialFormData] = useState<FormData>({
    hasGst: true, // Pre-selected GST
    hasLut: false,
    adCode: "",
    ieCode: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "1234567890123456", // Prefilled but editable
    lutArn: "",
    lutValidityDate: "",
    gstCertificate: new File([""], "gst_certificate.pdf", { type: "application/pdf" }), // Pre-uploaded
    iecCertificate: new File([""], "iec_certificate.pdf", { type: "application/pdf" }), // Pre-uploaded
    adCodeCertificate: new File([""], "ad_code_certificate.pdf", { type: "application/pdf" }), // Pre-uploaded
    lutDocument: null,
  });
  const [commercialErrors, setCommercialErrors] = useState<FormErrors>({});
  const [commercialSubmitted, setCommercialSubmitted] = useState(false);

  // State for Non-Commercial form
  const [nonCommercialFormData, setNonCommercialFormData] = useState<NonCommercialFormData>({
    fullName: "",
    panNumber: "",
    aadharNumber: "",
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    panCard: null,
    aadharCard: null,
  });
  const [nonCommercialErrors, setNonCommercialErrors] = useState<NonCommercialFormErrors>({});
  const [nonCommercialSubmitted, setNonCommercialSubmitted] = useState(false);

  // Prefilled data for CSB 5 GST (simulating data from CSB 4)
  const prefilledData = {
    adCode: "AD123456789",
    ieCode: "IE987654321",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    accountNumber: "1234567890123456",
  };

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // LUT explanation text
  const lutExplanation = "LUT (Letter of Undertaking) allows you to export goods without paying GST upfront. You must have a valid GST registration to apply for LUT.";

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.hasGst && !formData.hasLut) {
      newErrors.taxType = "Please select at least one tax type";
    }
    if (!formData.adCode.trim()) {
      newErrors.adCode = "AD Code is required";
    }
    if (!formData.ieCode.trim()) {
      newErrors.ieCode = "IE Code is required";
    }
    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required";
    }
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    }
    if (!formData.gstCertificate) {
      newErrors.gstCertificate = "GST Certificate is required";
    }
    if (!formData.iecCertificate) {
      newErrors.iecCertificate = "IEC Certificate is required";
    }
    if (!formData.adCodeCertificate) {
      newErrors.adCodeCertificate = "AD Code Certificate is required";
    }
    if (formData.hasLut) {
      if (!formData.lutArn.trim()) {
        newErrors.lutArn = "LUT ARN is required";
      }
      if (!formData.lutValidityDate.trim()) {
        newErrors.lutValidityDate = "LUT Validity Date is required";
      }
      if (!formData.lutDocument) {
        newErrors.lutDocument = "LUT Document is required";
      }
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (submitted) {
      const newErrors = validateForm();
      setErrors(newErrors);
    }
  };

  const handleFileUpload = (field: keyof FormData) => {
    // Simulate file upload
    const fakeFile = new File([""], "document.pdf", { type: "application/pdf" });
    setFormData((prev) => ({ ...prev, [field]: fakeFile }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
      closeModal();
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({
      hasGst: true, // Fixed
      hasLut: false,
      adCode: "",
      ieCode: "",
      bankName: "",
      ifscCode: "",
      accountNumber: "",
      lutArn: "",
      lutValidityDate: "",
      gstCertificate: null,
      iecCertificate: null,
      adCodeCertificate: null,
      lutDocument: null,
    });
    setErrors({});
    setTouched({});
    setSubmitted(false);
    // Reset CSB 5 form
    setCsb5FormData({
      hasGst: true,
      hasLut: false,
      adCode: "",
      ieCode: "",
      bankName: "",
      ifscCode: "",
      accountNumber: "1234567890123456", // Prefilled but editable
      lutArn: "",
      lutValidityDate: "",
      gstCertificate: null,
      iecCertificate: null,
      adCodeCertificate: null,
      lutDocument: null,
    });
    setCsb5Errors({});
    setCsb5Submitted(false);
    // Reset CSB 5 LUT form
    setCsb5LutFormData({
      hasGst: true, // Fixed
      hasLut: true, // Fixed
      adCode: "",
      ieCode: "",
      bankName: "",
      ifscCode: "",
      accountNumber: "1234567890123456",
      lutArn: "XXXXXXXXXXXXXXXX",
      lutValidityDate: "2025-03-31",
      gstCertificate: null,
      iecCertificate: null,
      adCodeCertificate: null,
      lutDocument: new File([""], "lut_document.pdf", { type: "application/pdf" }),
    });
    setCsb5LutErrors({});
    setCsb5LutSubmitted(false);
    // Reset Commercial form
    setCommercialFormData({
      hasGst: true,
      hasLut: false,
      adCode: "",
      ieCode: "",
      bankName: "",
      ifscCode: "",
      accountNumber: "1234567890123456",
      lutArn: "",
      lutValidityDate: "",
      gstCertificate: new File([""], "gst_certificate.pdf", { type: "application/pdf" }),
      iecCertificate: new File([""], "iec_certificate.pdf", { type: "application/pdf" }),
      adCodeCertificate: new File([""], "ad_code_certificate.pdf", { type: "application/pdf" }),
      lutDocument: null,
    });
    setCommercialErrors({});
    setCommercialSubmitted(false);
    // Reset Non-Commercial form
    setNonCommercialFormData({
      fullName: "",
      panNumber: "",
      aadharNumber: "",
      bankName: "",
      ifscCode: "",
      accountNumber: "",
      panCard: null,
      aadharCard: null,
    });
    setNonCommercialErrors({});
    setNonCommercialSubmitted(false);
    setShowTooltip(null);
  };

  const getInputClassName = (field: keyof FormErrors) => {
    const baseClass = "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400";
    if (submitted && errors[field]) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300`;
  };

  // CSB 5 form validation
  const validateCsb5Form = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!csb5FormData.hasGst && !csb5FormData.hasLut) {
      newErrors.taxType = "Please select at least one tax type";
    }
    if (!csb5FormData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required";
    }
    if (!csb5FormData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    }
    if (!csb5FormData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    }
    if (!csb5FormData.gstCertificate) {
      newErrors.gstCertificate = "GST Certificate is required";
    }
    if (!csb5FormData.iecCertificate) {
      newErrors.iecCertificate = "IEC Certificate is required";
    }
    if (!csb5FormData.adCodeCertificate) {
      newErrors.adCodeCertificate = "AD Code Certificate is required";
    }
    if (csb5FormData.hasLut) {
      if (!csb5FormData.lutArn.trim()) {
        newErrors.lutArn = "LUT ARN is required";
      }
      if (!csb5FormData.lutValidityDate.trim()) {
        newErrors.lutValidityDate = "LUT Validity Date is required";
      }
      if (!csb5FormData.lutDocument) {
        newErrors.lutDocument = "LUT Document is required";
      }
    }
    return newErrors;
  };

  const handleCsb5InputChange = (field: keyof FormData, value: string) => {
    setCsb5FormData((prev) => ({ ...prev, [field]: value }));
    if (csb5Submitted) {
      setCsb5Errors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCsb5FileUpload = (field: keyof FormData) => {
    const fakeFile = new File([""], "document.pdf", { type: "application/pdf" });
    setCsb5FormData((prev) => ({ ...prev, [field]: fakeFile }));
    if (csb5Submitted) {
      setCsb5Errors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCsb5Submit = () => {
    setCsb5Submitted(true);
    const newErrors = validateCsb5Form();
    setCsb5Errors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
      closeModal();
    }
  };

  const getCsb5InputClassName = (field: keyof FormErrors) => {
    const baseClass = "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400";
    if (csb5Submitted && csb5Errors[field]) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300`;
  };

  // CSB 5 LUT form validation
  const validateCsb5LutForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    // LUT is fixed for this form, no need to validate tax type selection
    if (!csb5LutFormData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required";
    }
    if (!csb5LutFormData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    }
    if (!csb5LutFormData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    }
    if (!csb5LutFormData.gstCertificate) {
      newErrors.gstCertificate = "GST Certificate is required";
    }
    if (!csb5LutFormData.iecCertificate) {
      newErrors.iecCertificate = "IEC Certificate is required";
    }
    if (!csb5LutFormData.adCodeCertificate) {
      newErrors.adCodeCertificate = "AD Code Certificate is required";
    }
    // LUT fields are always required since LUT is fixed
    if (!csb5LutFormData.lutArn.trim()) {
      newErrors.lutArn = "LUT ARN is required";
    }
    if (!csb5LutFormData.lutValidityDate.trim()) {
      newErrors.lutValidityDate = "LUT Validity Date is required";
    }
    if (!csb5LutFormData.lutDocument) {
      newErrors.lutDocument = "LUT Document is required";
    }
    return newErrors;
  };

  const handleCsb5LutInputChange = (field: keyof FormData, value: string) => {
    setCsb5LutFormData((prev) => ({ ...prev, [field]: value }));
    if (csb5LutSubmitted) {
      setCsb5LutErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCsb5LutFileUpload = (field: keyof FormData) => {
    const fakeFile = new File([""], "document.pdf", { type: "application/pdf" });
    setCsb5LutFormData((prev) => ({ ...prev, [field]: fakeFile }));
    if (csb5LutSubmitted) {
      setCsb5LutErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCsb5LutSubmit = () => {
    setCsb5LutSubmitted(true);
    const newErrors = validateCsb5LutForm();
    setCsb5LutErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
      closeModal();
    }
  };

  const getCsb5LutInputClassName = (field: keyof FormErrors) => {
    const baseClass = "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400";
    if (csb5LutSubmitted && csb5LutErrors[field]) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300`;
  };

  // Commercial form validation
  const validateCommercialForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!commercialFormData.hasGst && !commercialFormData.hasLut) {
      newErrors.taxType = "Please select at least one tax type";
    }
    if (!commercialFormData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required";
    }
    if (!commercialFormData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    }
    if (!commercialFormData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    }
    if (!commercialFormData.gstCertificate) {
      newErrors.gstCertificate = "GST Certificate is required";
    }
    if (!commercialFormData.iecCertificate) {
      newErrors.iecCertificate = "IEC Certificate is required";
    }
    if (!commercialFormData.adCodeCertificate) {
      newErrors.adCodeCertificate = "AD Code Certificate is required";
    }
    if (commercialFormData.hasLut) {
      if (!commercialFormData.lutArn.trim()) {
        newErrors.lutArn = "LUT ARN is required";
      }
      if (!commercialFormData.lutValidityDate.trim()) {
        newErrors.lutValidityDate = "LUT Validity Date is required";
      }
      if (!commercialFormData.lutDocument) {
        newErrors.lutDocument = "LUT Document is required";
      }
    }
    return newErrors;
  };

  const handleCommercialInputChange = (field: keyof FormData, value: string) => {
    setCommercialFormData((prev) => ({ ...prev, [field]: value }));
    if (commercialSubmitted) {
      setCommercialErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCommercialFileUpload = (field: keyof FormData) => {
    const fakeFile = new File([""], "document.pdf", { type: "application/pdf" });
    setCommercialFormData((prev) => ({ ...prev, [field]: fakeFile }));
    if (commercialSubmitted) {
      setCommercialErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCommercialSubmit = () => {
    setCommercialSubmitted(true);
    const newErrors = validateCommercialForm();
    setCommercialErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
      closeModal();
    }
  };

  const getCommercialInputClassName = (field: keyof FormErrors) => {
    const baseClass = "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400";
    if (commercialSubmitted && commercialErrors[field]) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300`;
  };

  // Non-Commercial form validation
  const validateNonCommercialForm = (): NonCommercialFormErrors => {
    const newErrors: NonCommercialFormErrors = {};
    if (!nonCommercialFormData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!nonCommercialFormData.panNumber.trim()) {
      newErrors.panNumber = "PAN Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(nonCommercialFormData.panNumber.toUpperCase())) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
    }
    if (!nonCommercialFormData.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar Number is required";
    } else if (!/^\d{12}$/.test(nonCommercialFormData.aadharNumber.replace(/\s/g, ""))) {
      newErrors.aadharNumber = "Invalid Aadhar format (12 digits)";
    }
    if (!nonCommercialFormData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required";
    }
    if (!nonCommercialFormData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    }
    if (!nonCommercialFormData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    }
    if (!nonCommercialFormData.panCard) {
      newErrors.panCard = "PAN Card is required";
    }
    if (!nonCommercialFormData.aadharCard) {
      newErrors.aadharCard = "Aadhar Card is required";
    }
    return newErrors;
  };

  const handleNonCommercialInputChange = (field: keyof NonCommercialFormData, value: string) => {
    setNonCommercialFormData((prev) => ({ ...prev, [field]: value }));
    if (nonCommercialSubmitted) {
      setNonCommercialErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNonCommercialFileUpload = (field: keyof NonCommercialFormData) => {
    const fakeFile = new File([""], "document.pdf", { type: "application/pdf" });
    setNonCommercialFormData((prev) => ({ ...prev, [field]: fakeFile }));
    if (nonCommercialSubmitted) {
      setNonCommercialErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNonCommercialSubmit = () => {
    setNonCommercialSubmitted(true);
    const newErrors = validateNonCommercialForm();
    setNonCommercialErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Non-Commercial onboarding submitted successfully!");
      closeModal();
    }
  };

  const getNonCommercialInputClassName = (field: keyof NonCommercialFormErrors) => {
    const baseClass = "w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400";
    if (nonCommercialSubmitted && nonCommercialErrors[field]) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-orange-800 mb-4">
          India Post Services
        </h1>
        <p className="text-lg text-zinc-600 mb-8">
          Select your customer type
        </p>

        {/* Customer Type Selection */}
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          <button
            onClick={() => { setSelectedOnboarding("noncommercial"); setActiveModal("csb4"); }}
            className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
          >
            CSB 4 Customer
          </button>
          <button
            onClick={() => { setSelectedOnboarding("commercial"); setActiveModal("csb5gst"); }}
            className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
          >
            CSB 5 GST
          </button>
          <button
            onClick={() => { setSelectedOnboarding("commercial"); setActiveModal("csb5lut"); }}
            className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
          >
            CSB 5 LUT Customer
          </button>
          <button
            onClick={() => { setSelectedOnboarding("commercial"); setActiveModal("commercial"); }}
            className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
          >
            Commercial Customer
          </button>
        </div>

        {/* Upgrade to Commercial Section */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-orange-800">
            Upgrade to Commercial
          </h2>
          <p className="text-lg text-zinc-600">
            Already a non-commercial customer? Upgrade to commercial
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
            <button
              onClick={() => { setSelectedOnboarding("commercial"); setActiveModal("upgrade-csb4"); }}
              className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
            >
              CSB 4 Customer
            </button>
            <button
              onClick={() => { setSelectedOnboarding("commercial"); setActiveModal("upgrade-csb5gst"); }}
              className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
            >
              CSB 5 GST
            </button>
            <button
              onClick={() => { setSelectedOnboarding("commercial"); setActiveModal("upgrade-csb5lut"); }}
              className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
            >
              CSB 5 LUT Customer
            </button>
            <button
              onClick={() => { setSelectedOnboarding("commercial"); setActiveModal("upgrade-commercial"); }}
              className="px-8 py-4 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-200 min-w-[200px]"
            >
              Commercial Customer
            </button>
          </div>
        </div>
      </main>

      {/* CSB 4 Customer Modal with Validation */}
      {activeModal === "csb4" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Enable Indiapost
                  </h2>
                  {selectedOnboarding === "commercial" ? (
                    <p className="mt-2 text-sm">
                      <span className="text-red-500 font-medium">Note: </span>
                      <span className="text-gray-500">For registered exporters. Requires </span>
                      <span className="font-semibold text-gray-800">GST, IEC & AD Code</span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm">
                      <span className="text-blue-500 font-medium">Note: </span>
                      <span className="text-gray-500">For shipments like </span>
                      <span className="font-semibold text-gray-800">gifts, samples, or non-business items</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Onboarding Type Selection Card - Non-Commercial first for CSB4 */}
              <div className="px-8 pt-6">
                <div className="bg-gray-50 rounded-xl p-1.5 flex gap-1.5">
                  <button
                    onClick={() => setSelectedOnboarding("noncommercial")}
                    className={`flex-1 rounded-lg px-4 py-4 transition-all duration-300 ${
                      selectedOnboarding === "noncommercial"
                        ? "bg-white text-gray-800 shadow-sm border border-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <span className="font-semibold">Non-Commercial</span>
                      </div>
                      <span className={`text-xs ${selectedOnboarding === "noncommercial" ? "text-gray-500" : "text-gray-400"}`}>For Gifts & Samples</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedOnboarding("commercial")}
                    className={`flex-1 rounded-lg px-4 py-4 transition-all duration-300 ${
                      selectedOnboarding === "commercial"
                        ? "bg-white text-gray-800 shadow-sm border border-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold">Commercial</span>
                      </div>
                      <span className={`text-xs ${selectedOnboarding === "commercial" ? "text-gray-500" : "text-gray-400"}`}>For Businesses</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-6 min-h-[420px]">
              {selectedOnboarding === "commercial" ? (
                <>
                  {/* Tax Type Section - GST fixed, LUT selectable */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Select your applicable tax registration</p>
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">GST</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            formData.hasLut ? "bg-blue-500 border-blue-500" : "border-gray-300"
                          }`}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, hasLut: !prev.hasLut }));
                          }}
                        >
                          {formData.hasLut && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700">LUT</span>
                        <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                        <div className="relative">
                          <span
                            className="text-gray-400 cursor-help text-xs"
                            onMouseEnter={() => setShowTooltip("lutCsb4")}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            ⓘ
                          </span>
                          {showTooltip === "lutCsb4" && (
                            <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-64 z-10">
                              {lutExplanation}
                              <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

              {/* LUT Details Section - Only shown when LUT is selected */}
              {formData.hasLut && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="csb4-lutArn"
                          value={formData.lutArn}
                          onChange={(e) => handleInputChange("lutArn", e.target.value)}
                          onBlur={() => handleBlur("lutArn")}
                          className={`${getInputClassName("lutArn")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="csb4-lutArn"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          LUT ARN <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {submitted && errors.lutArn && (
                        <p className="text-red-500 text-xs mt-1">{errors.lutArn}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="date"
                          id="csb4-lutValidityDate"
                          value={formData.lutValidityDate}
                          onChange={(e) => handleInputChange("lutValidityDate", e.target.value)}
                          onBlur={() => handleBlur("lutValidityDate")}
                          className={`${getInputClassName("lutValidityDate")} peer pt-5`}
                        />
                        <label
                          htmlFor="csb4-lutValidityDate"
                          className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                        >
                          LUT Validity Date <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {submitted && errors.lutValidityDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.lutValidityDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Export Codes Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Your AD Code and IEC for international shipping</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb4-adCode"
                        value={formData.adCode}
                        onChange={(e) => handleInputChange("adCode", e.target.value)}
                        onBlur={() => handleBlur("adCode")}
                        className={`${getInputClassName("adCode")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb4-adCode"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        AD Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {submitted && errors.adCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.adCode}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb4-ieCode"
                        value={formData.ieCode}
                        onChange={(e) => handleInputChange("ieCode", e.target.value)}
                        onBlur={() => handleBlur("ieCode")}
                        className={`${getInputClassName("ieCode")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb4-ieCode"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        IE Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {submitted && errors.ieCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.ieCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Bank account linked to your AD Code</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb4-bankName"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        onBlur={() => handleBlur("bankName")}
                        className={`${getInputClassName("bankName")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb4-bankName"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {submitted && errors.bankName && (
                      <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb4-ifscCode"
                        value={formData.ifscCode}
                        onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                        onBlur={() => handleBlur("ifscCode")}
                        className={`${getInputClassName("ifscCode")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb4-ifscCode"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {submitted && errors.ifscCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb4-accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        onBlur={() => handleBlur("accountNumber")}
                        className={`${getInputClassName("accountNumber")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb4-accountNumber"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Account Number <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {submitted && errors.accountNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document List Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* GST Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      submitted && errors.gstCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {formData.gstCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFileUpload("gstCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {submitted && errors.gstCertificate && (
                      <p className="text-red-500 text-xs mt-1">{errors.gstCertificate}</p>
                    )}
                  </div>

                  {/* IEC Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      submitted && errors.iecCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {formData.iecCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFileUpload("iecCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {submitted && errors.iecCertificate && (
                      <p className="text-red-500 text-xs mt-1">{errors.iecCertificate}</p>
                    )}
                  </div>

                  {/* AD Code Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      submitted && errors.adCodeCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {formData.adCodeCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFileUpload("adCodeCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {submitted && errors.adCodeCertificate && (
                      <p className="text-red-500 text-xs mt-1">{errors.adCodeCertificate}</p>
                    )}
                  </div>

                  {/* LUT Document - Only shown when LUT is selected */}
                  {formData.hasLut && (
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        submitted && errors.lutDocument ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {formData.lutDocument ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleFileUpload("lutDocument")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {submitted && errors.lutDocument && (
                        <p className="text-red-500 text-xs mt-1">{errors.lutDocument}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
                </>
              ) : (
                <>
                  {/* Non-Commercial Identity Verification Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Identity Verification</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Provide your identity details for customs verification</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb4-nc-fullName"
                            value={nonCommercialFormData.fullName}
                            onChange={(e) => handleNonCommercialInputChange("fullName", e.target.value)}
                            className={`${getNonCommercialInputClassName("fullName")} peer pt-5`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="csb4-nc-fullName"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb4-nc-panNumber"
                            value={nonCommercialFormData.panNumber}
                            onChange={(e) => handleNonCommercialInputChange("panNumber", e.target.value.toUpperCase())}
                            className={`${getNonCommercialInputClassName("panNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={10}
                          />
                          <label
                            htmlFor="csb4-nc-panNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            PAN Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panNumber}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb4-nc-aadharNumber"
                            value={nonCommercialFormData.aadharNumber}
                            onChange={(e) => handleNonCommercialInputChange("aadharNumber", e.target.value.replace(/\D/g, ""))}
                            className={`${getNonCommercialInputClassName("aadharNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={12}
                          />
                          <label
                            htmlFor="csb4-nc-aadharNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Aadhar Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Non-Commercial Document Upload Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {/* PAN Card Upload */}
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.panCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">PAN Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.panCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("panCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panCard}</p>
                        )}
                      </div>

                      {/* Aadhar Card Upload */}
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.aadharCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">Aadhar Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.aadharCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("aadharCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharCard}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={selectedOnboarding === "commercial" ? handleSubmit : handleNonCommercialSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSB 5 GST Customer Modal - Editable tax type, prefilled export codes with tooltip, editable bank details */}
      {activeModal === "csb5gst" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Enable Indiapost
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your India Post onboarding to start shipping
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Onboarding Type Selection Card */}
              <div className="px-8 pt-6">
                <div className="bg-gray-50 rounded-xl p-1.5 flex gap-1.5">
                  <button
                    onClick={() => setSelectedOnboarding("commercial")}
                    className={`flex-1 rounded-lg px-4 py-4 transition-all duration-300 ${
                      selectedOnboarding === "commercial"
                        ? "bg-white text-gray-800 shadow-sm border border-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold">Commercial</span>
                      </div>
                      <span className={`text-xs ${selectedOnboarding === "commercial" ? "text-gray-500" : "text-gray-400"}`}>For Businesses</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedOnboarding("noncommercial")}
                    className={`flex-1 rounded-lg px-4 py-4 transition-all duration-300 ${
                      selectedOnboarding === "noncommercial"
                        ? "bg-white text-gray-800 shadow-sm border border-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <span className="font-semibold">Non-Commercial</span>
                      </div>
                      <span className={`text-xs ${selectedOnboarding === "noncommercial" ? "text-gray-500" : "text-gray-400"}`}>For Gifts & Samples</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-6 min-h-[420px]">
                {selectedOnboarding === "commercial" ? (
                  <>
                    {/* Tax Type Section - GST fixed, LUT selectable */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Select your applicable tax registration</p>
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">GST</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            csb5FormData.hasLut ? "bg-blue-500 border-blue-500" : "border-gray-300"
                          }`}
                          onClick={() => {
                            setCsb5FormData((prev) => ({ ...prev, hasLut: !prev.hasLut }));
                          }}
                        >
                          {csb5FormData.hasLut && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700">LUT</span>
                        <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                        <div className="relative">
                          <span
                            className="text-gray-400 cursor-help text-xs"
                            onMouseEnter={() => setShowTooltip("lutCsb5Gst")}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            ⓘ
                          </span>
                          {showTooltip === "lutCsb5Gst" && (
                            <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-64 z-10">
                              {lutExplanation}
                              <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* LUT Details Section - Only shown when LUT is selected */}
                  {csb5FormData.hasLut && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="csb5gst-lutArn"
                          value={csb5FormData.lutArn}
                          onChange={(e) => handleCsb5InputChange("lutArn", e.target.value)}
                          className={`${getCsb5InputClassName("lutArn")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="csb5gst-lutArn"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          LUT ARN <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5Submitted && csb5Errors.lutArn && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.lutArn}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="date"
                          id="csb5gst-lutValidityDate"
                          value={csb5FormData.lutValidityDate}
                          onChange={(e) => handleCsb5InputChange("lutValidityDate", e.target.value)}
                          className={`${getCsb5InputClassName("lutValidityDate")} peer pt-5`}
                        />
                        <label
                          htmlFor="csb5gst-lutValidityDate"
                          className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                        >
                          LUT Validity Date <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5Submitted && csb5Errors.lutValidityDate && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.lutValidityDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Export Codes Section - Prefilled with tooltip */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                  <div className="relative">
                    <span
                      className="text-gray-400 cursor-help text-xs"
                      onMouseEnter={() => setShowTooltip("exportCodes")}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      ⓘ
                    </span>
                    {showTooltip === "exportCodes" && (
                      <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10">
                        Prefilled from CSB 5 Onboarding
                        <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Your AD Code and IEC for international shipping</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="csb5gst-adCode"
                      value={prefilledData.adCode}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="csb5gst-adCode"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      AD Code
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="csb5gst-ieCode"
                      value={prefilledData.ieCode}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="csb5gst-ieCode"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      IE Code
                    </label>
                  </div>
                </div>
              </div>

              {/* Bank Details Section - Editable */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Bank account linked to your AD Code</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb5gst-bankName"
                        value={csb5FormData.bankName}
                        onChange={(e) => handleCsb5InputChange("bankName", e.target.value)}
                        className={`${getCsb5InputClassName("bankName")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb5gst-bankName"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {csb5Submitted && csb5Errors.bankName && (
                      <p className="text-red-500 text-xs mt-1">{csb5Errors.bankName}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb5gst-ifscCode"
                        value={csb5FormData.ifscCode}
                        onChange={(e) => handleCsb5InputChange("ifscCode", e.target.value)}
                        className={`${getCsb5InputClassName("ifscCode")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb5gst-ifscCode"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {csb5Submitted && csb5Errors.ifscCode && (
                      <p className="text-red-500 text-xs mt-1">{csb5Errors.ifscCode}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb5gst-accountNumber"
                        value={csb5FormData.accountNumber}
                        onChange={(e) => handleCsb5InputChange("accountNumber", e.target.value)}
                        className={`${getCsb5InputClassName("accountNumber")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb5gst-accountNumber"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Account Number <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {csb5Submitted && csb5Errors.accountNumber && (
                      <p className="text-red-500 text-xs mt-1">{csb5Errors.accountNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document List Section - Enabled uploads with LUT logic */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* GST Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      csb5Submitted && csb5Errors.gstCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {csb5FormData.gstCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCsb5FileUpload("gstCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {csb5Submitted && csb5Errors.gstCertificate && (
                      <p className="text-red-500 text-xs mt-1">{csb5Errors.gstCertificate}</p>
                    )}
                  </div>

                  {/* IEC Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      csb5Submitted && csb5Errors.iecCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {csb5FormData.iecCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCsb5FileUpload("iecCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {csb5Submitted && csb5Errors.iecCertificate && (
                      <p className="text-red-500 text-xs mt-1">{csb5Errors.iecCertificate}</p>
                    )}
                  </div>

                  {/* AD Code Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      csb5Submitted && csb5Errors.adCodeCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {csb5FormData.adCodeCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCsb5FileUpload("adCodeCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {csb5Submitted && csb5Errors.adCodeCertificate && (
                      <p className="text-red-500 text-xs mt-1">{csb5Errors.adCodeCertificate}</p>
                    )}
                  </div>

                  {/* LUT Document - Only shown when LUT is selected */}
                  {csb5FormData.hasLut && (
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        csb5Submitted && csb5Errors.lutDocument ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {csb5FormData.lutDocument ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCsb5FileUpload("lutDocument")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {csb5Submitted && csb5Errors.lutDocument && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.lutDocument}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
                </>
              ) : (
                <>
                  {/* Non-Commercial Identity Verification Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Identity Verification</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Provide your identity details for customs verification</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb5gst-nc-fullName"
                            value={nonCommercialFormData.fullName}
                            onChange={(e) => handleNonCommercialInputChange("fullName", e.target.value)}
                            className={`${getNonCommercialInputClassName("fullName")} peer pt-5`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="csb5gst-nc-fullName"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Full Name (as per PAN) <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb5gst-nc-panNumber"
                            value={nonCommercialFormData.panNumber}
                            onChange={(e) => handleNonCommercialInputChange("panNumber", e.target.value.toUpperCase())}
                            className={`${getNonCommercialInputClassName("panNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={10}
                          />
                          <label
                            htmlFor="csb5gst-nc-panNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            PAN Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panNumber}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb5gst-nc-aadharNumber"
                            value={nonCommercialFormData.aadharNumber}
                            onChange={(e) => handleNonCommercialInputChange("aadharNumber", e.target.value.replace(/\D/g, ""))}
                            className={`${getNonCommercialInputClassName("aadharNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={12}
                          />
                          <label
                            htmlFor="csb5gst-nc-aadharNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Aadhar Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Non-Commercial Document Upload Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.panCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">PAN Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.panCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("panCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panCard}</p>
                        )}
                      </div>
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.aadharCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">Aadhar Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.aadharCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("aadharCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharCard}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={selectedOnboarding === "commercial" ? handleCsb5Submit : handleNonCommercialSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSB 5 LUT Customer Modal - Same as CSB 5 GST with LUT pre-selected and LUT doc uploaded */}
      {activeModal === "csb5lut" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Enable Indiapost
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your India Post onboarding to start shipping
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Onboarding Type Selection Card */}
              <div className="px-8 pt-6">
                <div className="bg-gray-50 rounded-xl p-1.5 flex gap-1.5">
                  <button
                    onClick={() => setSelectedOnboarding("commercial")}
                    className={`flex-1 rounded-lg px-4 py-3 transition-all duration-300 ${
                      selectedOnboarding === "commercial"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-semibold">Commercial</span>
                      <span className={`text-xs ${selectedOnboarding === "commercial" ? "text-gray-500" : "text-gray-400"}`}>For Businesses</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedOnboarding("noncommercial")}
                    className={`flex-1 rounded-lg px-4 py-3 transition-all duration-300 ${
                      selectedOnboarding === "noncommercial"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold">Non-Commercial</span>
                      <span className={`text-xs ${selectedOnboarding === "noncommercial" ? "text-gray-500" : "text-gray-400"}`}>For Gifts & Samples</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-6 min-h-[420px]">
                {selectedOnboarding === "commercial" ? (
                  <>
                    {/* Tax Type Section - Both GST and LUT fixed, cannot be changed */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Your tax registrations (pre-selected for CSB 5 LUT)</p>
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">GST</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">LUT</span>
                        <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                        <div className="relative">
                          <span
                            className="text-gray-400 cursor-help text-xs"
                            onMouseEnter={() => setShowTooltip("lutCsb5Lut")}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            ⓘ
                          </span>
                          {showTooltip === "lutCsb5Lut" && (
                            <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-64 z-10">
                              {lutExplanation}
                              <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* LUT Details Section - Prefilled since LUT is fixed */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information (prefilled from GST)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="csb5lut-lutArn"
                      value={csb5LutFormData.lutArn}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="csb5lut-lutArn"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      LUT ARN
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="csb5lut-lutValidityDate"
                      value={csb5LutFormData.lutValidityDate}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="csb5lut-lutValidityDate"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      LUT Validity Date
                    </label>
                  </div>
                </div>
              </div>

              {/* Export Codes Section - Prefilled with tooltip */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                  <div className="relative">
                    <span
                      className="text-gray-400 cursor-help text-xs"
                      onMouseEnter={() => setShowTooltip("exportCodesLut")}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      ⓘ
                    </span>
                    {showTooltip === "exportCodesLut" && (
                      <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10">
                        Prefilled from CSB 5 Onboarding
                        <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Your export registration codes (prefilled)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="csb5lut-adCode"
                      value={prefilledData.adCode}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="csb5lut-adCode"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      AD Code
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="csb5lut-ieCode"
                      value={prefilledData.ieCode}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="csb5lut-ieCode"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      IE Code
                    </label>
                  </div>
                </div>
              </div>

              {/* Bank Details Section - Editable */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                  <span className="text-xs text-gray-400">(Same as on AD Code)</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Your bank account information for export payments</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb5lut-bankName"
                        value={csb5LutFormData.bankName}
                        onChange={(e) => handleCsb5LutInputChange("bankName", e.target.value)}
                        className={`${getCsb5LutInputClassName("bankName")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb5lut-bankName"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {csb5LutSubmitted && csb5LutErrors.bankName && (
                      <p className="text-red-500 text-xs mt-1">{csb5LutErrors.bankName}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb5lut-ifscCode"
                        value={csb5LutFormData.ifscCode}
                        onChange={(e) => handleCsb5LutInputChange("ifscCode", e.target.value)}
                        className={`${getCsb5LutInputClassName("ifscCode")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb5lut-ifscCode"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {csb5LutSubmitted && csb5LutErrors.ifscCode && (
                      <p className="text-red-500 text-xs mt-1">{csb5LutErrors.ifscCode}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="csb5lut-accountNumber"
                        value={csb5LutFormData.accountNumber}
                        onChange={(e) => handleCsb5LutInputChange("accountNumber", e.target.value)}
                        className={`${getCsb5LutInputClassName("accountNumber")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="csb5lut-accountNumber"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Account Number <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {csb5LutSubmitted && csb5LutErrors.accountNumber && (
                      <p className="text-red-500 text-xs mt-1">{csb5LutErrors.accountNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document List Section - Enabled uploads with LUT pre-uploaded */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Upload required documents for verification</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* GST Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      csb5LutSubmitted && csb5LutErrors.gstCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {csb5LutFormData.gstCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCsb5LutFileUpload("gstCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {csb5LutSubmitted && csb5LutErrors.gstCertificate && (
                      <p className="text-red-500 text-xs mt-1">{csb5LutErrors.gstCertificate}</p>
                    )}
                  </div>

                  {/* IEC Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      csb5LutSubmitted && csb5LutErrors.iecCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {csb5LutFormData.iecCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCsb5LutFileUpload("iecCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {csb5LutSubmitted && csb5LutErrors.iecCertificate && (
                      <p className="text-red-500 text-xs mt-1">{csb5LutErrors.iecCertificate}</p>
                    )}
                  </div>

                  {/* AD Code Certificate */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      csb5LutSubmitted && csb5LutErrors.adCodeCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      {csb5LutFormData.adCodeCertificate ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCsb5LutFileUpload("adCodeCertificate")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {csb5LutSubmitted && csb5LutErrors.adCodeCertificate && (
                      <p className="text-red-500 text-xs mt-1">{csb5LutErrors.adCodeCertificate}</p>
                    )}
                  </div>

                  {/* LUT Document - Pre-uploaded, always shown since LUT is fixed */}
                  <div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Uploaded
                      </span>
                    </div>
                  </div>
                </div>
              </div>
                </>
              ) : (
                <>
                  {/* Non-Commercial Identity Verification Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Identity Verification</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Provide your identity details for customs verification</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb5lut-nc-fullName"
                            value={nonCommercialFormData.fullName}
                            onChange={(e) => handleNonCommercialInputChange("fullName", e.target.value)}
                            className={`${getNonCommercialInputClassName("fullName")} peer pt-5`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="csb5lut-nc-fullName"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Full Name (as per PAN) <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb5lut-nc-panNumber"
                            value={nonCommercialFormData.panNumber}
                            onChange={(e) => handleNonCommercialInputChange("panNumber", e.target.value.toUpperCase())}
                            className={`${getNonCommercialInputClassName("panNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={10}
                          />
                          <label
                            htmlFor="csb5lut-nc-panNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            PAN Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panNumber}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="csb5lut-nc-aadharNumber"
                            value={nonCommercialFormData.aadharNumber}
                            onChange={(e) => handleNonCommercialInputChange("aadharNumber", e.target.value.replace(/\D/g, ""))}
                            className={`${getNonCommercialInputClassName("aadharNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={12}
                          />
                          <label
                            htmlFor="csb5lut-nc-aadharNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Aadhar Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Non-Commercial Document Upload Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.panCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">PAN Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.panCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("panCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panCard}</p>
                        )}
                      </div>
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.aadharCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">Aadhar Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.aadharCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("aadharCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharCard}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={selectedOnboarding === "commercial" ? handleCsb5LutSubmit : handleNonCommercialSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commercial Customer Modal - Same as CSB 5 GST with prefilled export codes and documents */}
      {activeModal === "commercial" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Enable Indiapost
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your India Post onboarding to start shipping
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Onboarding Type Selection Card */}
              <div className="px-8 pt-6">
                <div className="bg-gray-50 rounded-xl p-1.5 flex gap-1.5">
                  <button
                    onClick={() => setSelectedOnboarding("commercial")}
                    className={`flex-1 rounded-lg px-4 py-3 transition-all duration-300 ${
                      selectedOnboarding === "commercial"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-semibold">Commercial</span>
                      <span className={`text-xs ${selectedOnboarding === "commercial" ? "text-gray-500" : "text-gray-400"}`}>For Businesses</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedOnboarding("noncommercial")}
                    className={`flex-1 rounded-lg px-4 py-3 transition-all duration-300 ${
                      selectedOnboarding === "noncommercial"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold">Non-Commercial</span>
                      <span className={`text-xs ${selectedOnboarding === "noncommercial" ? "text-gray-500" : "text-gray-400"}`}>For Gifts & Samples</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-6 min-h-[420px]">
                {selectedOnboarding === "commercial" ? (
                  <>
                    {/* Tax Type Section - GST fixed, LUT selectable */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Select your applicable tax registrations</p>
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">GST</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            commercialFormData.hasLut ? "bg-blue-500 border-blue-500" : "border-gray-300"
                          }`}
                          onClick={() => {
                            setCommercialFormData((prev) => ({ ...prev, hasLut: !prev.hasLut }));
                          }}
                        >
                          {commercialFormData.hasLut && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700">LUT</span>
                        <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                        <div className="relative">
                          <span
                            className="text-gray-400 cursor-help text-xs"
                            onMouseEnter={() => setShowTooltip("lutCommercial")}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            ⓘ
                          </span>
                          {showTooltip === "lutCommercial" && (
                            <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-64 z-10">
                              {lutExplanation}
                              <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* LUT Details Section - Only shown when LUT is selected */}
                  {commercialFormData.hasLut && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="commercial-lutArn"
                          value={commercialFormData.lutArn}
                          onChange={(e) => handleCommercialInputChange("lutArn", e.target.value)}
                          className={`${getCommercialInputClassName("lutArn")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="commercial-lutArn"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          LUT ARN <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {commercialSubmitted && commercialErrors.lutArn && (
                        <p className="text-red-500 text-xs mt-1">{commercialErrors.lutArn}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="date"
                          id="commercial-lutValidityDate"
                          value={commercialFormData.lutValidityDate}
                          onChange={(e) => handleCommercialInputChange("lutValidityDate", e.target.value)}
                          className={`${getCommercialInputClassName("lutValidityDate")} peer pt-5`}
                        />
                        <label
                          htmlFor="commercial-lutValidityDate"
                          className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                        >
                          LUT Validity Date <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {commercialSubmitted && commercialErrors.lutValidityDate && (
                        <p className="text-red-500 text-xs mt-1">{commercialErrors.lutValidityDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Export Codes Section - Prefilled with tooltip */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                  <div className="relative">
                    <span
                      className="text-gray-400 cursor-help text-xs"
                      onMouseEnter={() => setShowTooltip("exportCodesCommercial")}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      ⓘ
                    </span>
                    {showTooltip === "exportCodesCommercial" && (
                      <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10">
                        Prefilled from CSB 5 Onboarding
                        <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Your export registration codes (prefilled)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="commercial-adCode"
                      value={prefilledData.adCode}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="commercial-adCode"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      AD Code
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="commercial-ieCode"
                      value={prefilledData.ieCode}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="commercial-ieCode"
                      className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                    >
                      IE Code
                    </label>
                  </div>
                </div>
              </div>

              {/* Bank Details Section - Editable */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                  <span className="text-xs text-gray-400">(Same as on AD Code)</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Your bank account information for export payments</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="commercial-bankName"
                        value={commercialFormData.bankName}
                        onChange={(e) => handleCommercialInputChange("bankName", e.target.value)}
                        className={`${getCommercialInputClassName("bankName")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="commercial-bankName"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {commercialSubmitted && commercialErrors.bankName && (
                      <p className="text-red-500 text-xs mt-1">{commercialErrors.bankName}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="commercial-ifscCode"
                        value={commercialFormData.ifscCode}
                        onChange={(e) => handleCommercialInputChange("ifscCode", e.target.value)}
                        className={`${getCommercialInputClassName("ifscCode")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="commercial-ifscCode"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {commercialSubmitted && commercialErrors.ifscCode && (
                      <p className="text-red-500 text-xs mt-1">{commercialErrors.ifscCode}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="commercial-accountNumber"
                        value={commercialFormData.accountNumber}
                        onChange={(e) => handleCommercialInputChange("accountNumber", e.target.value)}
                        className={`${getCommercialInputClassName("accountNumber")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="commercial-accountNumber"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Account Number <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {commercialSubmitted && commercialErrors.accountNumber && (
                      <p className="text-red-500 text-xs mt-1">{commercialErrors.accountNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document List Section - GST, IEC, AD Code pre-uploaded */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Upload required documents for verification</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* GST Certificate - Pre-uploaded */}
                  <div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Uploaded
                      </span>
                    </div>
                  </div>

                  {/* IEC Certificate - Pre-uploaded */}
                  <div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Uploaded
                      </span>
                    </div>
                  </div>

                  {/* AD Code Certificate - Pre-uploaded */}
                  <div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                        <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Uploaded
                      </span>
                    </div>
                  </div>

                  {/* LUT Document - Only shown when LUT is selected */}
                  {commercialFormData.hasLut && (
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        commercialSubmitted && commercialErrors.lutDocument ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {commercialFormData.lutDocument ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCommercialFileUpload("lutDocument")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {commercialSubmitted && commercialErrors.lutDocument && (
                        <p className="text-red-500 text-xs mt-1">{commercialErrors.lutDocument}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
                </>
              ) : (
                <>
                  {/* Non-Commercial Identity Verification Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Identity Verification</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Provide your identity details for customs verification</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="commercial-nc-fullName"
                            value={nonCommercialFormData.fullName}
                            onChange={(e) => handleNonCommercialInputChange("fullName", e.target.value)}
                            className={`${getNonCommercialInputClassName("fullName")} peer pt-5`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="commercial-nc-fullName"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Full Name (as per PAN) <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="commercial-nc-panNumber"
                            value={nonCommercialFormData.panNumber}
                            onChange={(e) => handleNonCommercialInputChange("panNumber", e.target.value.toUpperCase())}
                            className={`${getNonCommercialInputClassName("panNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={10}
                          />
                          <label
                            htmlFor="commercial-nc-panNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            PAN Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panNumber}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="commercial-nc-aadharNumber"
                            value={nonCommercialFormData.aadharNumber}
                            onChange={(e) => handleNonCommercialInputChange("aadharNumber", e.target.value.replace(/\D/g, ""))}
                            className={`${getNonCommercialInputClassName("aadharNumber")} peer pt-5`}
                            placeholder=" "
                            maxLength={12}
                          />
                          <label
                            htmlFor="commercial-nc-aadharNumber"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            Aadhar Number <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharNumber && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Non-Commercial Document Upload Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.panCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">PAN Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.panCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("panCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.panCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panCard}</p>
                        )}
                      </div>
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          nonCommercialSubmitted && nonCommercialErrors.aadharCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">Aadhar Card <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {nonCommercialFormData.aadharCard ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleNonCommercialFileUpload("aadharCard")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {nonCommercialSubmitted && nonCommercialErrors.aadharCard && (
                          <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharCard}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={selectedOnboarding === "commercial" ? handleCommercialSubmit : handleNonCommercialSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-Commercial Onboarding Modal - PAN & Aadhar based */}
      {activeModal === "noncommercial" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-blue-50 px-8 py-6 rounded-t-2xl border-b border-blue-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Non-Commercial Onboarding
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your India Post onboarding for gifts and samples (without GST)
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Content */}
              <div className="px-8 py-6 space-y-6">
                {/* Identity Details Section */}
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">Identity Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="noncommercial-fullName"
                        value={nonCommercialFormData.fullName}
                        onChange={(e) => handleNonCommercialInputChange("fullName", e.target.value)}
                        className={`${getNonCommercialInputClassName("fullName")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="noncommercial-fullName"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Full Name (as per PAN) <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.fullName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Identity Details Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Identity Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="noncommercial-panNumber"
                        value={nonCommercialFormData.panNumber}
                        onChange={(e) => handleNonCommercialInputChange("panNumber", e.target.value.toUpperCase())}
                        className={`${getNonCommercialInputClassName("panNumber")} peer pt-5`}
                        placeholder=" "
                        maxLength={10}
                      />
                      <label
                        htmlFor="noncommercial-panNumber"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        PAN Number <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.panNumber && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panNumber}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="noncommercial-aadharNumber"
                        value={nonCommercialFormData.aadharNumber}
                        onChange={(e) => handleNonCommercialInputChange("aadharNumber", e.target.value.replace(/\D/g, ""))}
                        className={`${getNonCommercialInputClassName("aadharNumber")} peer pt-5`}
                        placeholder=" "
                        maxLength={12}
                      />
                      <label
                        htmlFor="noncommercial-aadharNumber"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Aadhar Number <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.aadharNumber && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Bank Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="noncommercial-bankName"
                        value={nonCommercialFormData.bankName}
                        onChange={(e) => handleNonCommercialInputChange("bankName", e.target.value)}
                        className={`${getNonCommercialInputClassName("bankName")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="noncommercial-bankName"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.bankName && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.bankName}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="noncommercial-ifscCode"
                        value={nonCommercialFormData.ifscCode}
                        onChange={(e) => handleNonCommercialInputChange("ifscCode", e.target.value.toUpperCase())}
                        className={`${getNonCommercialInputClassName("ifscCode")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="noncommercial-ifscCode"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.ifscCode && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.ifscCode}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        id="noncommercial-accountNumber"
                        value={nonCommercialFormData.accountNumber}
                        onChange={(e) => handleNonCommercialInputChange("accountNumber", e.target.value)}
                        className={`${getNonCommercialInputClassName("accountNumber")} peer pt-5`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="noncommercial-accountNumber"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                      >
                        Account Number <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.accountNumber && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.accountNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Document Upload</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* PAN Card Upload */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      nonCommercialSubmitted && nonCommercialErrors.panCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">PAN Card <span className="text-red-500">*</span></span>
                        <div className="relative">
                          <span
                            className="text-gray-400 cursor-help text-xs"
                            onMouseEnter={() => setShowTooltip("panCard")}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            ⓘ
                          </span>
                          {showTooltip === "panCard" && (
                            <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-48 z-10">
                              Upload a clear copy of your PAN Card
                              <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      {nonCommercialFormData.panCard ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleNonCommercialFileUpload("panCard")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.panCard && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.panCard}</p>
                    )}
                  </div>

                  {/* Aadhar Card Upload */}
                  <div>
                    <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                      nonCommercialSubmitted && nonCommercialErrors.aadharCard ? "bg-red-50 border border-red-300" : "bg-gray-50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-sm">Aadhar Card <span className="text-red-500">*</span></span>
                        <div className="relative">
                          <span
                            className="text-gray-400 cursor-help text-xs"
                            onMouseEnter={() => setShowTooltip("aadharCard")}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            ⓘ
                          </span>
                          {showTooltip === "aadharCard" && (
                            <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-48 z-10">
                              Upload front and back of your Aadhar Card
                              <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      {nonCommercialFormData.aadharCard ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      ) : (
                        <button
                          onClick={() => handleNonCommercialFileUpload("aadharCard")}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </button>
                      )}
                    </div>
                    {nonCommercialSubmitted && nonCommercialErrors.aadharCard && (
                      <p className="text-red-500 text-xs mt-1">{nonCommercialErrors.aadharCard}</p>
                    )}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleNonCommercialSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade CSB 4 Modal - Commercial Only */}
      {activeModal === "upgrade-csb4" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Upgrade to Commercial
                  </h2>
                  <p className="mt-2 text-sm">
                    <span className="text-red-500 font-medium">Note: </span>
                    <span className="text-gray-500">For registered exporters. Requires </span>
                    <span className="font-semibold text-gray-800">GST, IEC & AD Code</span>
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Content */}
              <div className="px-8 py-6 space-y-6">
                {/* Tax Type Section - GST fixed, LUT selectable */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Select your applicable tax registration</p>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">GST</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          formData.hasLut ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, hasLut: !prev.hasLut }));
                        }}
                      >
                        {formData.hasLut && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700">LUT</span>
                      <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                      <div className="relative">
                        <span
                          className="text-gray-400 cursor-help text-xs"
                          onMouseEnter={() => setShowTooltip("lutUpgradeCsb4")}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          ⓘ
                        </span>
                        {showTooltip === "lutUpgradeCsb4" && (
                          <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-64 z-10">
                            {lutExplanation}
                            <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* LUT Details Section - Only shown when LUT is selected */}
                {formData.hasLut && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="upgrade-csb4-lutArn"
                            value={formData.lutArn}
                            onChange={(e) => handleInputChange("lutArn", e.target.value)}
                            onBlur={() => handleBlur("lutArn")}
                            className={`${getInputClassName("lutArn")} peer pt-5`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="upgrade-csb4-lutArn"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            LUT ARN <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {submitted && errors.lutArn && (
                          <p className="text-red-500 text-xs mt-1">{errors.lutArn}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="date"
                            id="upgrade-csb4-lutValidityDate"
                            value={formData.lutValidityDate}
                            onChange={(e) => handleInputChange("lutValidityDate", e.target.value)}
                            onBlur={() => handleBlur("lutValidityDate")}
                            className={`${getInputClassName("lutValidityDate")} peer pt-5`}
                          />
                          <label
                            htmlFor="upgrade-csb4-lutValidityDate"
                            className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                          >
                            LUT Validity Date <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {submitted && errors.lutValidityDate && (
                          <p className="text-red-500 text-xs mt-1">{errors.lutValidityDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Export Codes Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your AD Code and IEC for international shipping</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb4-adCode"
                          value={formData.adCode}
                          onChange={(e) => handleInputChange("adCode", e.target.value)}
                          onBlur={() => handleBlur("adCode")}
                          className={`${getInputClassName("adCode")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb4-adCode"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          AD Code <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {submitted && errors.adCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.adCode}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb4-ieCode"
                          value={formData.ieCode}
                          onChange={(e) => handleInputChange("ieCode", e.target.value)}
                          onBlur={() => handleBlur("ieCode")}
                          className={`${getInputClassName("ieCode")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb4-ieCode"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          IE Code <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {submitted && errors.ieCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.ieCode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bank Details Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Bank account linked to your AD Code</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb4-bankName"
                          value={formData.bankName}
                          onChange={(e) => handleInputChange("bankName", e.target.value)}
                          onBlur={() => handleBlur("bankName")}
                          className={`${getInputClassName("bankName")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb4-bankName"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {submitted && errors.bankName && (
                        <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb4-ifscCode"
                          value={formData.ifscCode}
                          onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                          onBlur={() => handleBlur("ifscCode")}
                          className={`${getInputClassName("ifscCode")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb4-ifscCode"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {submitted && errors.ifscCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb4-accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                          onBlur={() => handleBlur("accountNumber")}
                          className={`${getInputClassName("accountNumber")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb4-accountNumber"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Account Number <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {submitted && errors.accountNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document List Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Upload required documents for verification</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* GST Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        submitted && errors.gstCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {formData.gstCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleFileUpload("gstCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {submitted && errors.gstCertificate && (
                        <p className="text-red-500 text-xs mt-1">{errors.gstCertificate}</p>
                      )}
                    </div>

                    {/* IEC Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        submitted && errors.iecCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {formData.iecCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleFileUpload("iecCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {submitted && errors.iecCertificate && (
                        <p className="text-red-500 text-xs mt-1">{errors.iecCertificate}</p>
                      )}
                    </div>

                    {/* AD Code Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        submitted && errors.adCodeCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {formData.adCodeCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleFileUpload("adCodeCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {submitted && errors.adCodeCertificate && (
                        <p className="text-red-500 text-xs mt-1">{errors.adCodeCertificate}</p>
                      )}
                    </div>

                    {/* LUT Document - Only shown when LUT is selected */}
                    {formData.hasLut && (
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          submitted && errors.lutDocument ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {formData.lutDocument ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleFileUpload("lutDocument")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {submitted && errors.lutDocument && (
                          <p className="text-red-500 text-xs mt-1">{errors.lutDocument}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade CSB 5 GST Modal - Commercial Only */}
      {activeModal === "upgrade-csb5gst" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Upgrade to Commercial
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your India Post onboarding to start shipping
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Content */}
              <div className="px-8 py-6 space-y-6">
                {/* Tax Type Section - GST fixed, LUT selectable */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Select your applicable tax registration</p>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">GST</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          csb5FormData.hasLut ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                        onClick={() => {
                          setCsb5FormData((prev) => ({ ...prev, hasLut: !prev.hasLut }));
                        }}
                      >
                        {csb5FormData.hasLut && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700">LUT</span>
                      <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                      <div className="relative">
                        <span
                          className="text-gray-400 cursor-help text-xs"
                          onMouseEnter={() => setShowTooltip("lutUpgradeCsb5Gst")}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          ⓘ
                        </span>
                        {showTooltip === "lutUpgradeCsb5Gst" && (
                          <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-64 z-10">
                            {lutExplanation}
                            <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* LUT Details Section - Only shown when LUT is selected */}
                {csb5FormData.hasLut && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="upgrade-csb5gst-lutArn"
                            value={csb5FormData.lutArn}
                            onChange={(e) => handleCsb5InputChange("lutArn", e.target.value)}
                            className={`${getCsb5InputClassName("lutArn")} peer pt-5`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="upgrade-csb5gst-lutArn"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            LUT ARN <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {csb5Submitted && csb5Errors.lutArn && (
                          <p className="text-red-500 text-xs mt-1">{csb5Errors.lutArn}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="date"
                            id="upgrade-csb5gst-lutValidityDate"
                            value={csb5FormData.lutValidityDate}
                            onChange={(e) => handleCsb5InputChange("lutValidityDate", e.target.value)}
                            className={`${getCsb5InputClassName("lutValidityDate")} peer pt-5`}
                          />
                          <label
                            htmlFor="upgrade-csb5gst-lutValidityDate"
                            className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                          >
                            LUT Validity Date <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {csb5Submitted && csb5Errors.lutValidityDate && (
                          <p className="text-red-500 text-xs mt-1">{csb5Errors.lutValidityDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Export Codes Section - Prefilled */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your export registration codes (prefilled)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-csb5gst-adCode"
                        value={prefilledData.adCode}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-csb5gst-adCode"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        AD Code
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-csb5gst-ieCode"
                        value={prefilledData.ieCode}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-csb5gst-ieCode"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        IE Code
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bank Details Section - Editable */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                    <span className="text-xs text-gray-400">(Same as on AD Code)</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your bank account information for export payments</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb5gst-bankName"
                          value={csb5FormData.bankName}
                          onChange={(e) => handleCsb5InputChange("bankName", e.target.value)}
                          className={`${getCsb5InputClassName("bankName")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb5gst-bankName"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5Submitted && csb5Errors.bankName && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.bankName}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb5gst-ifscCode"
                          value={csb5FormData.ifscCode}
                          onChange={(e) => handleCsb5InputChange("ifscCode", e.target.value)}
                          className={`${getCsb5InputClassName("ifscCode")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb5gst-ifscCode"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5Submitted && csb5Errors.ifscCode && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.ifscCode}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb5gst-accountNumber"
                          value={csb5FormData.accountNumber}
                          onChange={(e) => handleCsb5InputChange("accountNumber", e.target.value)}
                          className={`${getCsb5InputClassName("accountNumber")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb5gst-accountNumber"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Account Number <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5Submitted && csb5Errors.accountNumber && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.accountNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document List Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Upload required documents for verification</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* GST Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        csb5Submitted && csb5Errors.gstCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {csb5FormData.gstCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCsb5FileUpload("gstCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {csb5Submitted && csb5Errors.gstCertificate && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.gstCertificate}</p>
                      )}
                    </div>

                    {/* IEC Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        csb5Submitted && csb5Errors.iecCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {csb5FormData.iecCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCsb5FileUpload("iecCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {csb5Submitted && csb5Errors.iecCertificate && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.iecCertificate}</p>
                      )}
                    </div>

                    {/* AD Code Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        csb5Submitted && csb5Errors.adCodeCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {csb5FormData.adCodeCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCsb5FileUpload("adCodeCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {csb5Submitted && csb5Errors.adCodeCertificate && (
                        <p className="text-red-500 text-xs mt-1">{csb5Errors.adCodeCertificate}</p>
                      )}
                    </div>

                    {/* LUT Document - Only shown when LUT is selected */}
                    {csb5FormData.hasLut && (
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          csb5Submitted && csb5Errors.lutDocument ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {csb5FormData.lutDocument ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleCsb5FileUpload("lutDocument")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {csb5Submitted && csb5Errors.lutDocument && (
                          <p className="text-red-500 text-xs mt-1">{csb5Errors.lutDocument}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleCsb5Submit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade CSB 5 LUT Modal - Commercial Only */}
      {activeModal === "upgrade-csb5lut" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Upgrade to Commercial
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your India Post onboarding to start shipping
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Content */}
              <div className="px-8 py-6 space-y-6">
                {/* Tax Type Section - Both GST and LUT fixed */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your tax registrations (pre-selected for CSB 5 LUT)</p>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">GST</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">LUT</span>
                      <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                    </label>
                  </div>
                </div>

                {/* LUT Details Section - Prefilled */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information (prefilled from GST)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-csb5lut-lutArn"
                        value={csb5LutFormData.lutArn}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-csb5lut-lutArn"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        LUT ARN
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-csb5lut-lutValidityDate"
                        value={csb5LutFormData.lutValidityDate}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-csb5lut-lutValidityDate"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        LUT Validity Date
                      </label>
                    </div>
                  </div>
                </div>

                {/* Export Codes Section - Prefilled */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your export registration codes (prefilled)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-csb5lut-adCode"
                        value={prefilledData.adCode}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-csb5lut-adCode"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        AD Code
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-csb5lut-ieCode"
                        value={prefilledData.ieCode}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-csb5lut-ieCode"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        IE Code
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bank Details Section - Editable */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                    <span className="text-xs text-gray-400">(Same as on AD Code)</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your bank account information for export payments</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb5lut-bankName"
                          value={csb5LutFormData.bankName}
                          onChange={(e) => handleCsb5LutInputChange("bankName", e.target.value)}
                          className={`${getCsb5LutInputClassName("bankName")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb5lut-bankName"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5LutSubmitted && csb5LutErrors.bankName && (
                        <p className="text-red-500 text-xs mt-1">{csb5LutErrors.bankName}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb5lut-ifscCode"
                          value={csb5LutFormData.ifscCode}
                          onChange={(e) => handleCsb5LutInputChange("ifscCode", e.target.value)}
                          className={`${getCsb5LutInputClassName("ifscCode")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb5lut-ifscCode"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5LutSubmitted && csb5LutErrors.ifscCode && (
                        <p className="text-red-500 text-xs mt-1">{csb5LutErrors.ifscCode}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-csb5lut-accountNumber"
                          value={csb5LutFormData.accountNumber}
                          onChange={(e) => handleCsb5LutInputChange("accountNumber", e.target.value)}
                          className={`${getCsb5LutInputClassName("accountNumber")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-csb5lut-accountNumber"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Account Number <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {csb5LutSubmitted && csb5LutErrors.accountNumber && (
                        <p className="text-red-500 text-xs mt-1">{csb5LutErrors.accountNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document List Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Upload required documents for verification</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* GST Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        csb5LutSubmitted && csb5LutErrors.gstCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {csb5LutFormData.gstCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCsb5LutFileUpload("gstCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {csb5LutSubmitted && csb5LutErrors.gstCertificate && (
                        <p className="text-red-500 text-xs mt-1">{csb5LutErrors.gstCertificate}</p>
                      )}
                    </div>

                    {/* IEC Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        csb5LutSubmitted && csb5LutErrors.iecCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {csb5LutFormData.iecCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCsb5LutFileUpload("iecCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {csb5LutSubmitted && csb5LutErrors.iecCertificate && (
                        <p className="text-red-500 text-xs mt-1">{csb5LutErrors.iecCertificate}</p>
                      )}
                    </div>

                    {/* AD Code Certificate */}
                    <div>
                      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                        csb5LutSubmitted && csb5LutErrors.adCodeCertificate ? "bg-red-50 border border-red-300" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        {csb5LutFormData.adCodeCertificate ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploaded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCsb5LutFileUpload("adCodeCertificate")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload
                          </button>
                        )}
                      </div>
                      {csb5LutSubmitted && csb5LutErrors.adCodeCertificate && (
                        <p className="text-red-500 text-xs mt-1">{csb5LutErrors.adCodeCertificate}</p>
                      )}
                    </div>

                    {/* LUT Document - Pre-uploaded */}
                    <div>
                      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleCsb5LutSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Commercial Modal - Commercial Only */}
      {activeModal === "upgrade-commercial" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 rounded-t-2xl border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Upgrade to Commercial
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your India Post onboarding to start shipping
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Content */}
              <div className="px-8 py-6 space-y-6">
                {/* Tax Type Section - GST fixed, LUT selectable */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Tax Type</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Select your applicable tax registrations</p>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border-2 bg-blue-500 border-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">GST</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          commercialFormData.hasLut ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                        onClick={() => {
                          setCommercialFormData((prev) => ({ ...prev, hasLut: !prev.hasLut }));
                        }}
                      >
                        {commercialFormData.hasLut && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700">LUT</span>
                      <span className="text-gray-400 text-sm">(Against Bond or UT)</span>
                      <div className="relative">
                        <span
                          className="text-gray-400 cursor-help text-xs"
                          onMouseEnter={() => setShowTooltip("lutUpgradeCommercial")}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          ⓘ
                        </span>
                        {showTooltip === "lutUpgradeCommercial" && (
                          <div className="absolute left-0 bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 w-64 z-10">
                            {lutExplanation}
                            <div className="absolute left-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* LUT Details Section - Only shown when LUT is selected */}
                {commercialFormData.hasLut && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-gray-800">LUT Details</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Letter of Undertaking information</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            id="upgrade-commercial-lutArn"
                            value={commercialFormData.lutArn}
                            onChange={(e) => handleCommercialInputChange("lutArn", e.target.value)}
                            className={`${getCommercialInputClassName("lutArn")} peer pt-5`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="upgrade-commercial-lutArn"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                          >
                            LUT ARN <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {commercialSubmitted && commercialErrors.lutArn && (
                          <p className="text-red-500 text-xs mt-1">{commercialErrors.lutArn}</p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="date"
                            id="upgrade-commercial-lutValidityDate"
                            value={commercialFormData.lutValidityDate}
                            onChange={(e) => handleCommercialInputChange("lutValidityDate", e.target.value)}
                            className={`${getCommercialInputClassName("lutValidityDate")} peer pt-5`}
                          />
                          <label
                            htmlFor="upgrade-commercial-lutValidityDate"
                            className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                          >
                            LUT Validity Date <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {commercialSubmitted && commercialErrors.lutValidityDate && (
                          <p className="text-red-500 text-xs mt-1">{commercialErrors.lutValidityDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Export Codes Section - Prefilled */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Export Codes</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your export registration codes (prefilled)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-commercial-adCode"
                        value={prefilledData.adCode}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-commercial-adCode"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        AD Code
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="upgrade-commercial-ieCode"
                        value={prefilledData.ieCode}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 pt-5 pb-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="upgrade-commercial-ieCode"
                        className="absolute left-4 top-2.5 text-xs text-blue-500 pointer-events-none transition-all duration-200"
                      >
                        IE Code
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bank Details Section - Editable */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Bank Details</h3>
                    <span className="text-xs text-gray-400">(Same as on AD Code)</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Your bank account information for export payments</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-commercial-bankName"
                          value={commercialFormData.bankName}
                          onChange={(e) => handleCommercialInputChange("bankName", e.target.value)}
                          className={`${getCommercialInputClassName("bankName")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-commercial-bankName"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {commercialSubmitted && commercialErrors.bankName && (
                        <p className="text-red-500 text-xs mt-1">{commercialErrors.bankName}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-commercial-ifscCode"
                          value={commercialFormData.ifscCode}
                          onChange={(e) => handleCommercialInputChange("ifscCode", e.target.value)}
                          className={`${getCommercialInputClassName("ifscCode")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-commercial-ifscCode"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {commercialSubmitted && commercialErrors.ifscCode && (
                        <p className="text-red-500 text-xs mt-1">{commercialErrors.ifscCode}</p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          id="upgrade-commercial-accountNumber"
                          value={commercialFormData.accountNumber}
                          onChange={(e) => handleCommercialInputChange("accountNumber", e.target.value)}
                          className={`${getCommercialInputClassName("accountNumber")} peer pt-5`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="upgrade-commercial-accountNumber"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-xs"
                        >
                          Account Number <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {commercialSubmitted && commercialErrors.accountNumber && (
                        <p className="text-red-500 text-xs mt-1">{commercialErrors.accountNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document List Section - All pre-uploaded */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-800">Document List</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Upload required documents for verification</p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* GST Certificate - Pre-uploaded */}
                    <div>
                      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">GST Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      </div>
                    </div>

                    {/* IEC Certificate - Pre-uploaded */}
                    <div>
                      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">IEC Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      </div>
                    </div>

                    {/* AD Code Certificate - Pre-uploaded */}
                    <div>
                      <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">AD Code Certificate <span className="text-red-500">*</span></span>
                          <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      </div>
                    </div>

                    {/* LUT Document - Only shown when LUT is selected */}
                    {commercialFormData.hasLut && (
                      <div>
                        <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                          commercialSubmitted && commercialErrors.lutDocument ? "bg-red-50 border border-red-300" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 text-sm">LUT Document <span className="text-red-500">*</span></span>
                            <span className="text-gray-400 cursor-help text-xs">ⓘ</span>
                          </div>
                          {commercialFormData.lutDocument ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Uploaded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleCommercialFileUpload("lutDocument")}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Upload
                            </button>
                          )}
                        </div>
                        {commercialSubmitted && commercialErrors.lutDocument && (
                          <p className="text-red-500 text-xs mt-1">{commercialErrors.lutDocument}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleCommercialSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
