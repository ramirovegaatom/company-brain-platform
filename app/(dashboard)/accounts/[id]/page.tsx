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
import { OverviewSection } from "@/components/accounts/overview-section";
import { AdoptionSnapshot } from "@/components/accounts/adoption-snapshot";
import { CampaignTable } from "@/components/accounts/campaign-table";
import { ConversationMetrics } from "@/components/accounts/conversation-metrics";
import { DealsList } from "@/components/accounts/deals-list";
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
    dealsData,
    isLoading,
    isLoadingContext,
    isLoadingCalls,
    isLoadingHealth,
    isLoadingSupport,
    isLoadingDeals,
    contextError,
    callsError,
    supportError,
    dealsError,
    error,
    retryContext,
    loadCallSummaries,
    loadSupport,
    loadDeals,
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

  const meta = client.metadata || {};
  const dealCount = meta.crm_associated_deals as string | undefined;

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
          if (value === "deals") loadDeals();
        }}
      >
        <TabsList>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deals">
            Deals{dealCount ? ` (${dealCount})` : ""}
          </TabsTrigger>
          <TabsTrigger value="support">
            Support{meta.intercom_convs_30d ? ` (${meta.intercom_convs_30d})` : ""}
          </TabsTrigger>
          <TabsTrigger value="calls">
            Calls{meta.total_calls_30d ? ` (${meta.total_calls_30d})` : ""}
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

        <TabsContent value="overview" className="space-y-4 mt-4">
          <OverviewSection metadata={meta} mrr={client.mrr} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AdoptionSnapshot metadata={meta} />
            <ConversationMetrics metadata={meta} />
          </div>
          <CampaignTable metadata={meta} />
        </TabsContent>

        <TabsContent value="deals" className="mt-4">
          <DealsList
            data={dealsData}
            isLoading={isLoadingDeals}
            error={dealsError}
          />
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
