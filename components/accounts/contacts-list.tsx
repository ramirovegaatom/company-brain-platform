"use client";

import { Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contact } from "@/lib/types";

interface ContactsListProps {
  contacts: Contact[];
}

export function ContactsList({ contacts }: ContactsListProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-foreground/10 py-12 text-sm text-muted-foreground">
        Sin contactos registrados
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-foreground/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="w-[80px]">Champion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {contact.email || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {contact.role || "—"}
              </TableCell>
              <TableCell>
                {contact.is_champion && (
                  <Star className="size-4 text-amber-400 fill-amber-400" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
