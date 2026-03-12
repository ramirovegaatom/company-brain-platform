"use client";

import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientHeader } from "@/components/accounts/client-header";
import { ContextCardView } from "@/components/accounts/context-card-view";
import { SignalsList } from "@/components/accounts/signals-list";
import { PatternMatches } from "@/components/accounts/pattern-matches";
import { ContactsList } from "@/components/accounts/contacts-list";
import { useClientDetail } from "@/hooks/use-client-detail";

export default function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    client,
    signals,
    contacts,
    contextCard,
    isLoading,
    isLoadingContext,
    contextError,
    error,
    retryContext,
  } = useClientDetail(id);

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-6 py-4 text-sm text-red-400">
          Error cargando cuenta: {error}
        </div>
      </div>
    );
  }

  if (isLoading || !client) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-80" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientHeader
        client={client}
        healthTrend={contextCard?.health_trend}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signals">
            Signals{signals.length > 0 && ` (${signals.length})`}
          </TabsTrigger>
          <TabsTrigger value="contacts">
            Contacts{contacts.length > 0 && ` (${contacts.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <ContextCardView
            contextCard={contextCard}
            isLoading={isLoadingContext}
            error={contextError}
            onRetry={retryContext}
          />
          {contextCard && contextCard.pattern_matches.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Pattern Matches</h3>
              <PatternMatches patterns={contextCard.pattern_matches} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="signals" className="mt-4">
          <SignalsList signals={signals} />
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <ContactsList contacts={contacts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
