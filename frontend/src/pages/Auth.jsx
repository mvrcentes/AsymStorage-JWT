import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Login from "./Login"
import Register from "./Register"

const Auth = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Tabs defaultValue="login" className="w-[400px] space-y-4">
        <TabsList className="grid w-full grid-cols-2 gap-2 bg-muted p-1 rounded-md">
          <TabsTrigger
            value="login"
            className="rounded-none border border-border bg-transparent text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-white">
            Login
          </TabsTrigger>

          <TabsTrigger
            value="register"
            className="rounded-none border border-border bg-transparent text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-white">
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Inicia sesión con tu cuenta existente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Login />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Registro</CardTitle>
              <CardDescription>
                Crea una nueva cuenta para comenzar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Register />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Auth
