import { MessageCircle } from "lucide-react";

import {
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "../components/ui/sidebar";
import { Sidebar } from "../components/ui/sidebar";

const LuminaSidebar = () => {
  const items = [
    {
      title: "Chat",
      url: "#",
      icon: MessageCircle,
    },
  ];
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroupLabel className="text-2xl mt-4 ml-4">
            Lumina
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="pl-6 text-lg">
                    <a href={item.url}>
                      <item.icon className="text-xl" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default LuminaSidebar;
