"use client";

import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientHeader } from "@/components/accounts/client-header";
import { KpiHeroBar } from "@/components/accounts/kpi-hero-bar";
import { ContextCardView } from "@/components/accounts/context-card-view";
import { SignalsList } from "@/components/accounts/signals-list";
import { PatternMatches } from "@/components/accounts/pattern-matches";
import { ContactsList } from "@/components/accounts/contacts-list";
import { UsageSection } from "@/components/accounts/usage-section";
import { AdoptionSnapshot } from "@/components/accounts/adoption-snapshot";
import { CampaignTable } from "@/components/accounts/campaign-table";
import { ConversationMetrics } from "@/components/accounts/conversation-metrics";
import { CallHistory } from "@/components/accounts/call-history";
import { SupportHistory } from "@/components/accounts/support-history";
import { AccountDataMap } from "@/components/accounts/account-data-map";
import { HealthBreakdown } from "@/components/accounts/health-breakdown";
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
    callSummaries,
    healthBreakdown,
    supportData,
    isLoading,
    isLoadingContext,
    isLoadingCalls,
    isLoadingHealth,
    isLoadingSupport,
    contextError,
    callsError,
    supportError,
    error,
    retryContext,
    loadCallSummaries,
    loadSupport,
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
            <Skeleton key={i} className="h-24 rounded-xl" />
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
        healthBreakdown={healthBreakdown}
      />

      <KpiHeroBar client={client} healthTrend={contextCard?.health_trend} healthBreakdown={healthBreakdown} />

      <HealthBreakdown breakdown={healthBreakdown} isLoading={isLoadingHealth} />

      <Tabs
        defaultValue="intelligence"
        className="w-full"
        onValueChange={(value) => {
          if (value === "calls") loadCallSummaries();
          if (value === "support") loadSupport();
        }}
      >
        <TabsList>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="support">
            Support{client.metadata?.intercom_convs_30d ? ` (${client.metadata.intercom_convs_30d})` : ""}
          </TabsTrigger>
          <TabsTrigger value="calls">
            Calls{client.metadata?.total_calls_30d ? ` (${client.metadata.total_calls_30d})` : ""}
          </TabsTrigger>
          <TabsTrigger value="signals">
            Signals{signals.length > 0 ? ` (${signals.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="contacts">
            Contacts{contacts.length > 0 ? ` (${contacts.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="data-map">Data Map</TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence" className="space-y-4 mt-4">
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

        <TabsContent value="operations" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UsageSection metadata={client.metadata || {}} />
            <AdoptionSnapshot metadata={client.metadata || {}} />
          </div>
          <CampaignTable metadata={client.metadata || {}} />
          <ConversationMetrics metadata={client.metadata || {}} />
        </TabsContent>

        <TabsContent value="support" className="mt-4">
          <SupportHistory
            data={supportData}
            isLoading={isLoadingSupport}
            error={supportError}
          />
        </TabsContent>

        <TabsContent value="calls" className="mt-4">
          <CallHistory
            summaries={callSummaries}
            isLoading={isLoadingCalls}
            error={callsError}
          />
        </TabsContent>

        <TabsContent value="signals" className="mt-4">
          <SignalsList signals={signals} />
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <ContactsList contacts={contacts} />
        </TabsContent>

        <TabsContent value="data-map" className="mt-4">
          <AccountDataMap client={client} signals={signals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
