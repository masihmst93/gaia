import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Button, Skeleton, SkeletonGroup } from "heroui-native";
import { useCallback } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlarmClockIcon,
  BubbleChatIcon,
  CheckListIcon,
  Notification01Icon,
  ZapIcon,
} from "@/components/icons";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useResponsive } from "@/lib/responsive";
import { Divider } from "@/shared/components/ui/divider";
import { dashboardApi } from "../api/dashboard-api";
import { DashboardCard } from "./DashboardCard";
import { DashboardTodoItem } from "./DashboardTodoItem";

const ACCENT = "#00bbff";

function getGreeting(): string {
  // Personal Agent mobile defaults to Persian for Masih.
  const hour = new Date().getHours();
  if (hour < 12) return "صبح بخیر";
  if (hour < 17) return "عصر بخیر";
  return "شب بخیر";
}

function formatDate(): string {
  return new Date().toLocaleDateString("fa-IR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatReminderTime(nextRunAt: string | undefined): string {
  if (!nextRunAt) return "زمان‌بندی شده";
  const date = new Date(nextRunAt);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0) return "عقب‌افتاده";
  if (diffMins < 60) return `${diffMins} دقیقه دیگر`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ساعت دیگر`;
  return date.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
}

const QUERY_KEYS = {
  todayTodos: ["dashboard", "today-todos"] as const,
  recentConversations: ["dashboard", "recent-conversations"] as const,
  unreadCount: ["dashboard", "unread-count"] as const,
  upcomingReminders: ["dashboard", "upcoming-reminders"] as const,
  activeWorkflows: ["dashboard", "active-workflows"] as const,
};

type TodayTodo = Awaited<ReturnType<typeof dashboardApi.getTodayTodos>>[number];
type RecentConversation = Awaited<
  ReturnType<typeof dashboardApi.getRecentConversations>
>[number];
type UpcomingReminder = Awaited<
  ReturnType<typeof dashboardApi.getUpcomingReminders>
>[number];

function TodosCardBody({
  todos,
  isLoading,
}: {
  todos: TodayTodo[];
  isLoading: boolean;
}) {
  const { spacing, fontSize } = useResponsive();
  const router = useRouter();

  if (isLoading) {
    return (
      <SkeletonGroup isLoading style={{ padding: spacing.md, gap: spacing.sm }}>
        <SkeletonGroup.Item
          className="h-8 w-full rounded-xl"
          style={{ marginBottom: spacing.xs }}
        />
        <SkeletonGroup.Item
          className="h-8 w-4/5 rounded-xl"
          style={{ marginBottom: spacing.xs }}
        />
        <SkeletonGroup.Item className="h-8 w-3/4 rounded-xl" />
      </SkeletonGroup>
    );
  }

  if (todos.length === 0) return null;

  return (
    <>
      {todos.map((todo) => (
        <DashboardTodoItem key={todo.id} todo={todo} />
      ))}
      <Divider style={{ marginHorizontal: spacing.md }} />
      <Button
        variant="ghost"
        size="sm"
        onPress={() => {
          router.push("/(app)/(tabs)/todos");
        }}
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <Button.Label
          style={{ fontSize: fontSize.xs, color: ACCENT, fontWeight: "500" }}
        >
          مشاهده همه کارها
        </Button.Label>
      </Button>
    </>
  );
}

function ReminderRow({ reminder }: { reminder: UpcomingReminder }) {
  const { spacing, fontSize } = useResponsive();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        gap: spacing.sm,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: fontSize.sm,
            fontWeight: "500",
            color: "#e4e4e7",
          }}
        >
          {reminder.title}
        </Text>
        {reminder.description ? (
          <Text
            numberOfLines={1}
            style={{ fontSize: fontSize.xs, color: "#71717a", marginTop: 2 }}
          >
            {reminder.description}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          backgroundColor: "rgba(245,158,11,0.12)",
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 3,
        }}
      >
        <Text
          style={{ fontSize: fontSize.xs, color: "#f59e0b", fontWeight: "500" }}
        >
          {formatReminderTime(reminder.nextRunAt)}
        </Text>
      </View>
    </View>
  );
}

function RemindersCardBody({
  reminders,
  isLoading,
}: {
  reminders: UpcomingReminder[];
  isLoading: boolean;
}) {
  const { spacing } = useResponsive();

  if (isLoading) {
    return (
      <SkeletonGroup isLoading style={{ padding: spacing.md, gap: spacing.sm }}>
        <SkeletonGroup.Item
          className="h-10 w-full rounded-xl"
          style={{ marginBottom: spacing.xs }}
        />
        <SkeletonGroup.Item className="h-10 w-4/5 rounded-xl" />
      </SkeletonGroup>
    );
  }

  if (reminders.length === 0) return null;

  return (
    <>
      {reminders.map((reminder, index) => (
        <View key={reminder.id}>
          <ReminderRow reminder={reminder} />
          {index < reminders.length - 1 && (
            <Divider style={{ marginHorizontal: spacing.md }} />
          )}
        </View>
      ))}
    </>
  );
}

function ConversationsCardBody({
  conversations,
  isLoading,
}: {
  conversations: RecentConversation[];
  isLoading: boolean;
}) {
  const { spacing, fontSize } = useResponsive();

  if (isLoading) {
    return (
      <SkeletonGroup isLoading style={{ padding: spacing.md, gap: spacing.sm }}>
        <SkeletonGroup.Item
          className="h-8 w-full rounded-xl"
          style={{ marginBottom: spacing.xs }}
        />
        <SkeletonGroup.Item
          className="h-8 w-3/4 rounded-xl"
          style={{ marginBottom: spacing.xs }}
        />
        <SkeletonGroup.Item className="h-8 w-4/5 rounded-xl" />
      </SkeletonGroup>
    );
  }

  if (conversations.length === 0) return null;

  return (
    <>
      {conversations.map((conv, index) => (
        <View key={conv.id}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm + 2,
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: conv.is_unread
                  ? ACCENT
                  : "rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            />
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: fontSize.sm,
                fontWeight: conv.is_unread ? "600" : "400",
                color: conv.is_unread ? "#f4f4f5" : "#a1a1aa",
              }}
            >
              {conv.title}
            </Text>
          </View>
          {index < conversations.length - 1 && (
            <Divider style={{ marginHorizontal: spacing.md }} />
          )}
        </View>
      ))}
    </>
  );
}

function StatSubtitle({
  isLoading,
  text,
}: {
  isLoading: boolean;
  text: string;
}) {
  const { fontSize } = useResponsive();

  if (isLoading) {
    return (
      <Skeleton
        isLoading
        className="h-3 w-16 rounded"
        style={{ marginTop: 2 }}
      />
    );
  }

  return (
    <Text style={{ fontSize: fontSize.xs, color: "#71717a" }}>{text}</Text>
  );
}

type DashboardContentProps = {
  firstName: string;
  spacing: ReturnType<typeof useResponsive>["spacing"];
  fontSize: ReturnType<typeof useResponsive>["fontSize"];
  insets: ReturnType<typeof useSafeAreaInsets>;
  router: ReturnType<typeof useRouter>;
  todosQuery: UseQueryResult<TodayTodo[]>;
  conversationsQuery: UseQueryResult<RecentConversation[]>;
  unreadQuery: UseQueryResult<number>;
  remindersQuery: UseQueryResult<UpcomingReminder[]>;
  workflowsQuery: UseQueryResult<number>;
  isRefreshing: boolean;
  handleRefresh: () => void;
};

function emptySubtitle(
  count: number,
  isLoading: boolean,
  text: string,
): string | undefined {
  return count === 0 && !isLoading ? text : undefined;
}

function positiveBadge(count: number): number | undefined {
  return count > 0 ? count : undefined;
}

function DashboardContent({
  firstName,
  spacing,
  fontSize,
  insets,
  router,
  todosQuery,
  conversationsQuery,
  unreadQuery,
  remindersQuery,
  workflowsQuery,
  isRefreshing,
  handleRefresh,
}: DashboardContentProps) {
  const todayTodos = todosQuery.data ?? [];
  const conversations = conversationsQuery.data ?? [];
  const unreadCount = unreadQuery.data ?? 0;
  const reminders = remindersQuery.data ?? [];
  const activeWorkflowCount = workflowsQuery.data ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#111111" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={ACCENT}
            colors={[ACCENT]}
          />
        }
      >
        <View
          style={{
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: spacing.md,
          }}
        >
          <View style={{ marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: fontSize["2xl"],
                fontWeight: "700",
                color: "#f4f4f5",
              }}
            >
              {getGreeting()}، {firstName}
            </Text>
            <Text
              style={{ fontSize: fontSize.sm, color: "#71717a", marginTop: 4 }}
            >
              {formatDate()}
            </Text>
          </View>

          <DashboardCard
            title="کارهای امروز"
            icon={CheckListIcon}
            iconColor="#22c55e"
            badge={todosQuery.data?.length}
            subtitle={emptySubtitle(
              todayTodos.length,
              todosQuery.isLoading,
              "برای امروز کاری ثبت نشده",
            )}
            onPress={() => router.push("/(app)/(tabs)/todos")}
          >
            <TodosCardBody
              todos={todayTodos}
              isLoading={todosQuery.isLoading}
            />
          </DashboardCard>

          <DashboardCard
            title="یادآوری‌های پیش رو"
            icon={AlarmClockIcon}
            iconColor="#f59e0b"
            badge={positiveBadge(reminders.length)}
            subtitle={emptySubtitle(
              reminders.length,
              remindersQuery.isLoading,
              "یادآوری فعالی نداری",
            )}
          >
            <RemindersCardBody
              reminders={reminders}
              isLoading={remindersQuery.isLoading}
            />
          </DashboardCard>

          <DashboardCard
            title="گفت‌وگوهای اخیر"
            icon={BubbleChatIcon}
            iconColor={ACCENT}
            subtitle={emptySubtitle(
              conversations.length,
              conversationsQuery.isLoading,
              "هنوز گفت‌وگویی ثبت نشده",
            )}
            onPress={() => router.push("/(app)/(tabs)")}
          >
            <ConversationsCardBody
              conversations={conversations}
              isLoading={conversationsQuery.isLoading}
            />
          </DashboardCard>

          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <DashboardCard
                title="اتوماسیون‌ها"
                icon={ZapIcon}
                iconColor="#a78bfa"
                badge={positiveBadge(activeWorkflowCount)}
                subtitle={
                  <StatSubtitle
                    isLoading={workflowsQuery.isLoading}
                    text={`${activeWorkflowCount} فعال`}
                  />
                }
                onPress={() => router.push("/(app)/(tabs)/workflows")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DashboardCard
                title="اعلان‌ها"
                icon={Notification01Icon}
                iconColor="#f43f5e"
                badge={positiveBadge(unreadCount)}
                subtitle={
                  <StatSubtitle
                    isLoading={unreadQuery.isLoading}
                    text={
                      unreadCount > 0
                        ? `${unreadCount} خوانده‌نشده`
                        : "همه‌چیز بررسی شده"
                    }
                  />
                }
                onPress={() => router.push("/(app)/(tabs)/notifications")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export function DashboardScreen() {
  const { spacing, fontSize } = useResponsive();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] ?? "مسیح";

  const [
    todosQuery,
    conversationsQuery,
    unreadQuery,
    remindersQuery,
    workflowsQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: QUERY_KEYS.todayTodos,
        queryFn: dashboardApi.getTodayTodos,
        staleTime: 2 * 60 * 1000,
      },
      {
        queryKey: QUERY_KEYS.recentConversations,
        queryFn: dashboardApi.getRecentConversations,
        staleTime: 2 * 60 * 1000,
      },
      {
        queryKey: QUERY_KEYS.unreadCount,
        queryFn: dashboardApi.getUnreadNotificationsCount,
        staleTime: 60 * 1000,
      },
      {
        queryKey: QUERY_KEYS.upcomingReminders,
        queryFn: dashboardApi.getUpcomingReminders,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: QUERY_KEYS.activeWorkflows,
        queryFn: dashboardApi.getActiveWorkflowsCount,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  const isRefreshing =
    todosQuery.isRefetching ||
    conversationsQuery.isRefetching ||
    unreadQuery.isRefetching ||
    remindersQuery.isRefetching ||
    workflowsQuery.isRefetching;

  const handleRefresh = useCallback(() => {
    void todosQuery.refetch();
    void conversationsQuery.refetch();
    void unreadQuery.refetch();
    void remindersQuery.refetch();
    void workflowsQuery.refetch();
  }, [
    todosQuery,
    conversationsQuery,
    unreadQuery,
    remindersQuery,
    workflowsQuery,
  ]);

  return <DashboardContent firstName={firstName} spacing={spacing} fontSize={fontSize} insets={insets} router={router} todosQuery={todosQuery} conversationsQuery={conversationsQuery} unreadQuery={unreadQuery} remindersQuery={remindersQuery} workflowsQuery={workflowsQuery} isRefreshing={isRefreshing} handleRefresh={handleRefresh} />;
}
