import { Inter } from "next/font/google";
import "./globals.css";
import JobApplicationForm from "./components/JobApplicationForm";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Job Application Form",
  description: "This is a job application form",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JobApplicationForm/>
        {children}</body>
    </html>
  );
}
