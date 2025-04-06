"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Key } from "lucide-react"
import { useGossip } from "@/context/gossip-context"

export function ApiKeyForm() {
  const { apiKey, setApiKey, apiKeyStatus, validateApiKey, isValidatingApiKey } = useGossip()

  const [inputKey, setInputKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiKey(inputKey.trim())
    await validateApiKey()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Google Gemini API Key
        </CardTitle>
        <CardDescription>
          Enter your Google Gemini API key to generate gossip and images. You can get an API key from the{" "}
          <a
            href="https://ai.google.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline"
          >
            Google AI Studio
          </a>
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="pr-24"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your API key is stored locally in your browser and is never sent to our servers.
            </p>
          </div>

          <Button type="submit" disabled={isValidatingApiKey || !inputKey.trim()} className="w-full">
            {isValidatingApiKey ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Save & Validate API Key"
            )}
          </Button>
        </form>

        {apiKeyStatus && (
          <Alert
            className={`mt-4 ${apiKeyStatus.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            {apiKeyStatus.isValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>{apiKeyStatus.isValid ? "Valid API Key" : "Invalid API Key"}</AlertTitle>
            <AlertDescription>{apiKeyStatus.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 flex flex-col items-start">
        <p>Note: The Gemini API may have usage limits. Check your Google AI Studio dashboard for details.</p>
      </CardFooter>
    </Card>
  )
}

