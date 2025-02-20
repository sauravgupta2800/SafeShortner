"use client";

import { useEffect, useState } from "react";
import { Button,useToast, Spinner, Box, PinInput, PinInputField, HStack } from "@chakra-ui/react";
import axios from "axios";

interface SecurityData {
  isExpired?: boolean;
  requiresPasscode?: boolean;
  originalUrl?: string;
  error?: string;
}

export default function LinkPage() {
  const path = window.location.pathname;
  const id = path.split("/").pop() || "";
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    const checkLink = async () => {
      try {
        const response = await fetch(`/api/metadata/${id}`);
        const data = await response.json();
        
        if (data.isExpired) {
          toast({
            title: data.message,
            status: "error",
            duration: null,
            isClosable: true,
          });
          setSecurityData({ error: data.message });
          return;
        }

        if (!data.requiresPasscode) {
          window.location.replace(data.originalUrl);
          return;
        }
        setSecurityData(data);
      } catch (error) {
        toast({
          title: "Error loading link",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    checkLink();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/verify", {
        shortPath: id,
        passcode,
      });

      if (response.data.success) {
        window.location.href = response.data.originalUrl;
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        status: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-4">
        {securityData?.requiresPasscode && (
          <Box>
            <label className="block text-sm font-medium mb-2">
              6-Digit Passcode
            </label>
            <HStack>
              <PinInput value={passcode} onChange={setPasscode}>
                {[...Array(6)].map((_, i) => (
                  <PinInputField key={i} />
                ))}
              </PinInput>
            </HStack>
          </Box>
        )}

        <Button
          colorScheme="blue"
          w="full"
          onClick={handleSubmit}
          isDisabled={
            (securityData?.requiresPasscode && passcode.length !== 6) 
          }
        >
          Continue to Link
        </Button>
      </div>
    </main>
  );
}