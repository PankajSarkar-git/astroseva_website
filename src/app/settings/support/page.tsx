"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CustomerSupportPage = () => {
  const supportNumber = "+1-800-123-4567"; // Replace with your actual support number

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      {/* Header */}
      <h1 className="text-4xl font-medium mb-8 text-center">Customer Support</h1>

      {/* Support Info Card */}
      <Card className="p-8 max-w-md w-full text-center shadow-lg space-y-6">
        <p className="text-gray-600 text-lg">
          Need help? Our support team is here for you.
        </p>

        <div>
          <p className="text-gray-700 text-base mb-2">Call us at:</p>
          <p className="text-text-primary text-3xl font-semibold mb-4">{supportNumber}</p>
          <a href={`tel:${supportNumber}`}>
            <Button className="w-full bg-button-primary hover:bg-button-secondary text-white">
              Call Now
            </Button>
          </a>
        </div>
      </Card>

      {/* Support Hours */}
      <div className="mt-8 text-center max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Support Hours</h2>
        <p className="text-gray-600 leading-6">
          Monday - Friday: 9:00 AM - 6:00 PM
          <br />
          Saturday: 10:00 AM - 4:00 PM
          <br />
          Sunday: Closed
        </p>
      </div>
    </div>
  );
};

export default CustomerSupportPage;
