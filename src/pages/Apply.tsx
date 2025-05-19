
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ApplicationWizard from "@/components/application-wizard/ApplicationWizard";

const Apply = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is logged in
  if (!user) {
    navigate("/login", { state: { returnTo: "/apply" } });
    return null;
  }

  return <ApplicationWizard />;
};

export default Apply;
