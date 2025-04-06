"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"
import { checkApiKeyStatus } from "@/app/actions"

interface ApiKeyStatus {
  isValid: boolean
  message: string
}

export function ApiStatus() {
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    if (isChecking) return // Prevent multiple simultaneous checks

    setIsChecking(true)
    try {
      const status = await checkApiKeyStatus()
      setApiKeyStatus(status)
    } catch (error) {
      setApiKeyStatus({
        isValid: false,
        message: error instanceof Error ? error.message : "Failed to check API key status",
      })
    } finally {
      setIsChecking(false)
    }
  }

  // Check API key status on initial load only
  useEffect(() => {
    let isMounted = true

    const initialCheck = async () => {
      setIsChecking(true)
      try {
        const status = await checkApiKeyStatus()
        if (isMounted) {
          setApiKeyStatus(status)
        }
      } catch (error) {
        if (isMounted) {
          setApiKeyStatus({
            isValid: false,
            message: error instanceof Error ? error.message : "Failed to check API key status",
          })
        }
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }

    initialCheck()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Google Gemini API Status</CardTitle>
        <CardDescription>The application uses Google's Gemini API to generate gossip and images.</CardDescription>
      </CardHeader>
      <CardContent>
        {isChecking ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
            <span>Checking API key status...</span>
          </div>
        ) : apiKeyStatus ? (
          <Alert className={`${apiKeyStatus.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            {apiKeyStatus.isValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle>{apiKeyStatus.isValid ? "API Key is Valid" : "API Key Issue"}</AlertTitle>
            <AlertDescription>{apiKeyStatus.message}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          disabled={isChecking}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Status
        </Button>
        <p className="text-xs text-gray-500">
          To configure the API key, add GOOGLE_AI_API_KEY to your .env.local file.
        </p>
      </CardFooter>
    </Card>
  )
}

