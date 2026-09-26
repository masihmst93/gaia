"use client";

import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import {
  Alert01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  ZapIcon,
} from "@icons";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { GridSection } from "@/features/chat/components/interface/sections/GridSection";
import DummyComposer from "@/features/landing/components/demo/DummyComposer";
import { useHomePage } from "@/hooks/useHomePage";

function DashboardComposer({ isPersian }: { isPersian: boolean }) {
  const router = useRouter();

  return (
    <div className="relative mb-10 w-full px-4 sm:w-1/2 sm:px-0">
      {/* Visual-only — inert so nothing is interactive */}
      <div
        className="pointer-events-none [&_.searchbar_container]:pt-0 px-4"
        inert
      >
        <DummyComposer
          hideIntegrationBanner
          fullWidth
          className="max-w-none mx-0 items-stretch"
        />
      </div>
      {/* Invisible overlay captures all clicks → navigate to chat */}
      <button
        type="button"
        className="absolute inset-0 z-10 w-full cursor-text border-0 bg-transparent p-0"
        onClick={() => router.push("/c")}
        aria-label={isPersian ? "شروع گفتگو" : "Start a conversation"}
      />
    </div>
  );
}

interface DashboardSection {
  icon: ReactNode;
  count: number;
  label: string;
}

interface DashboardCounts {
  todaysMeetings: number;
  tasksDue: number;
  overdueTodosCount: number;
  unreadEmailsCount: number;
  activeWorkflows: number;
}

function dashboardLabel(
  isPersian: boolean,
  persian: string,
  count: number,
  singular: string,
  plural: string,
): string {
  if (isPersian) return persian;
  return count === 1 ? singular : plural;
}

function buildDashboardSections(
  {
    todaysMeetings,
    tasksDue,
    overdueTodosCount,
    unreadEmailsCount,
    activeWorkflows,
  }: DashboardCounts,
  isPersian = false,
): DashboardSection[] {
  const sections: DashboardSection[] = [];
  if (todaysMeetings > 0) {
    sections.push({
      icon: <Calendar03Icon className="w-7 h-7 text-blue-400" />,
      count: todaysMeetings,
      label: dashboardLabel(isPersian, "جلسه", todaysMeetings, "meeting", "meetings"),
    });
  }
  if (tasksDue > 0) {
    sections.push({
      icon: <CheckmarkCircle02Icon className="w-7 h-7 text-emerald-400" />,
      count: tasksDue,
      label: dashboardLabel(isPersian, "کار امروز", tasksDue, "task due", "tasks due"),
    });
  }
  if (overdueTodosCount > 0) {
    sections.push({
      icon: <Alert01Icon className="w-7 h-7 text-red-500" />,
      count: overdueTodosCount,
      label: dashboardLabel(
        isPersian,
        "کار عقب‌افتاده",
        overdueTodosCount,
        "overdue task",
        "overdue tasks",
      ),
    });
  }
  if (unreadEmailsCount > 0) {
    sections.push({
      icon: <Mail01Icon className="w-7 h-7 text-sky-400" />,
      count: unreadEmailsCount,
      label: dashboardLabel(
        isPersian,
        "ایمیل خوانده‌نشده",
        unreadEmailsCount,
        "unread email",
        "unread emails",
      ),
    });
  }
  if (activeWorkflows > 0) {
    sections.push({
      icon: <ZapIcon className="w-7 h-7 text-amber-500" />,
      count: activeWorkflows,
      label: dashboardLabel(
        isPersian,
        "اتوماسیون فعال",
        activeWorkflows,
        "workflow",
        "workflows",
      ),
    });
  }
  return sections;
}

function SummaryItem({ icon, count, label }: DashboardSection) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span className="font-medium text-white">{count}</span>
      <span>{label}</span>
    </span>
  );
}

function DashboardSummary({
  sections,
  hasTodayItems,
  isPersian,
}: {
  sections: DashboardSection[];
  hasTodayItems: boolean;
  isPersian: boolean;
}) {
  const firstLineSections = sections.slice(0, 2);
  const secondLineSections = sections.slice(2);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-3xl text-zinc-500">
        <span>{isPersian ? "امروز داری" : "You have"}</span>
        {firstLineSections.map((section, index) => (
          <span key={section.label}>
            <SummaryItem {...section} />
            {index < firstLineSections.length - 1 && <span>,</span>}
            {index === firstLineSections.length - 1 &&
              secondLineSections.length === 0 &&
              hasTodayItems && !isPersian && <span> today</span>}
            {index === firstLineSections.length - 1 &&
              secondLineSections.length === 0 &&
              !hasTodayItems && <span>.</span>}
            {index === firstLineSections.length - 1 &&
              secondLineSections.length > 0 && <span>,</span>}
          </span>
        ))}
      </div>

      {secondLineSections.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-3xl text-zinc-500">
          {secondLineSections.map((section, index) => (
            <span key={section.label}>
              <SummaryItem {...section} />
              {index < secondLineSections.length - 1 && <span>,</span>}
              {index === secondLineSections.length - 2 && !isPersian && <span> and</span>}
              {index === secondLineSections.length - 1 && hasTodayItems && !isPersian && (
                <span> today.</span>
              )}
              {index === secondLineSections.length - 1 && !hasTodayItems && (
                <span>.</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function TodayOverview({
  isPersian,
  dailyProgress,
  todayTasks,
  counts,
}: {
  isPersian: boolean;
  dailyProgress: { percent: number };
  todayTasks: ReturnType<typeof useHomePage>["todayTodos"];
  counts: ReturnType<typeof useHomePage>["counts"];
}) {
  const router = useRouter();

  return (
    <>
      <section className="mb-8 grid gap-3 px-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 sm:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">
                {isPersian ? "پیشرفت امروز" : "Today's progress"}
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {dailyProgress.percent}%
              </p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${dailyProgress.percent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/c")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-start"
        >
          <p className="text-sm text-zinc-500">
            {isPersian ? "دستیار روزانه" : "Daily assistant"}
          </p>
          <p className="mt-2 text-lg font-medium text-white">
            {isPersian ? "برنامه امروز من را بچین" : "Plan my day"}
          </p>
        </button>
      </section>

      <section className="mb-8 grid gap-3 px-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {isPersian ? "کارهای امروز" : "Today's tasks"}
            </h2>
            <button
              type="button"
              onClick={() => router.push("/todos")}
              className="text-sm text-zinc-400"
            >
              {isPersian ? "مشاهده همه" : "View all"}
            </button>
          </div>

          <div className="space-y-2">
            {todayTasks.map((todo) => (
              <button
                key={todo.id}
                type="button"
                onClick={() => router.push(`/todos?todoId=${todo.id}`)}
                className="flex w-full items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-start"
              >
                <span
                  className={`size-2.5 rounded-full ${
                    todo.completed ? "bg-emerald-400" : "bg-zinc-600"
                  }`}
                />
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                  {todo.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-xl font-semibold text-white">
            {isPersian ? "وضعیت امروز" : "Today at a glance"}
          </h2>
          <div className="mt-5 space-y-3 text-sm text-zinc-400">
            <p>
              {isPersian ? "جلسه" : "Meetings"}: {counts.todaysMeetings}
            </p>
            <p>
              {isPersian ? "ایمیل خوانده‌نشده" : "Unread email"}:{" "}
              {counts.unreadEmailsCount}
            </p>
            <p>
              {isPersian ? "عقب‌افتاده" : "Overdue"}: {counts.overdueTodosCount}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  const params = useParams<{ locale?: string }>();
  const isPersian = params?.locale === "fa";
  const {
    user,
    simpleGreeting,
    isLoading,
    hasData,
    hasTodayItems,
    counts,
    dailyProgress,
    todayTodos,
    events,
    calendars,
    unreadEmails,
    workflows,
    isCalendarConnected,
    isGmailConnected,
    calendarConnectLabel,
    gmailConnectLabel,
    emailsLoading,
    fetchMoreEmails,
    hasMoreEmails,
    emailsFetchingMore,
  } = useHomePage();

  const todayTasks = [...todayTodos]
    .sort((a, b) => Number(a.completed) - Number(b.completed))
    .slice(0, 6);

  // Build sections array for display
  const sections = buildDashboardSections(counts, isPersian);

  return (
    <div className="flex flex-col p-6 pt-0 min-h-screen h-fit overflow-y-scroll outline-none">
      <div className="flex flex-col p-3 mb-6 space-y-1">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-4xl font-medium text-zinc-700">
            {isPersian ? "سلام" : simpleGreeting}
          </h2>
          <div className="flex items-center gap-2">
            {user?.profilePicture && (
              <Avatar
                src={user?.profilePicture}
                name={user?.name || "User"}
                size="sm"
                className="shrink-0 ml-1 hover:scale-120 rotate-6 transition"
              />
            )}
            <h1 className="font-medium text-4xl text-zinc-700">
              {user?.name?.split(" ")[0]}
              <span className="ml-4">:)</span>
            </h1>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-[30vw] rounded-lg" />
            <Skeleton className="h-7 w-[50vw] rounded-lg" />
          </div>
        ) : hasData ? (
          <DashboardSummary
            sections={sections}
            hasTodayItems={hasTodayItems}
            isPersian={isPersian}
          />
        ) : (
          <p className="text-lg text-zinc-400">
            {isPersian ? "امروزت هنوز خالیه — بیا برنامه‌اش رو بچینیم." : "Your day is clear — time to plan ahead!"}
          </p>
        )}
      </div>

      <TodayOverview isPersian={isPersian} dailyProgress={dailyProgress} todayTasks={todayTasks} counts={counts} />

      <DashboardComposer isPersian={isPersian} />

      <GridSection
        events={events}
        calendars={calendars}
        unreadEmails={unreadEmails}
        workflows={workflows}
        isCalendarConnected={isCalendarConnected}
        isGmailConnected={isGmailConnected}
        calendarConnectLabel={calendarConnectLabel}
        gmailConnectLabel={gmailConnectLabel}
        emailsLoading={emailsLoading}
        onLoadMoreEmails={fetchMoreEmails}
        hasMoreEmails={hasMoreEmails}
        emailsFetchingMore={emailsFetchingMore}
      />
    </div>
  );
}
