// app/(site)/lawyers/my-consults/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { HumanConsultStatus } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LawyerMyConsultsPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "LAWYER" && user.role !== "ADMIN") {
    redirect("/");
  }

  const lawyerId = Number(user.id);

  // نجلب كل الطلبات التي للمحامي علاقة بها:
  // - إما تم اختياره فيها (lawyerId)
  // - أو قدّم عليها عرضاً (HumanConsultOffer.lawyerId)
  const requests = await prisma.humanConsultRequest.findMany({
    where: {
      OR: [
        { lawyerId }, // تم اختيار هذا المحامي للاستشارة
        {
          offers: {
            some: { lawyerId },
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      consultation: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      offers: {
        where: { lawyerId },
      },
      chatRoom: true,
    },
  });

  return (
    <main
      className="min-h-screen bg-zinc-950 text-zinc-50"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto px-4 py-8 text-right space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">استشاراتي كمحامٍ</h1>
          <p className="text-sm text-zinc-400">
            هنا تظهر الاستشارات التي قدّمتَ عليها عروضًا أو تم اختيارك لتنفيذها،
            مع إمكانية الدخول إلى غرفة المحادثة مع المستفيد إن وُجدت.
          </p>
        </header>

        {requests.length === 0 && (
          <p className="text-sm text-zinc-400">
            لا توجد حالياً استشارات مرتبطة بحسابك كمحامٍ.
          </p>
        )}

        {requests.length > 0 && (
          <section className="space-y-4">
            {requests.map((req) => {
              const consultation = req.consultation;
              const client = req.client;
              const myOffer = req.offers[0] || null;
              const chatRoomId = req.chatRoom?.id ?? null;

              const statusLabel = (() => {
                switch (req.status) {
                  case HumanConsultStatus.PENDING:
                    return "بانتظار اختيار المستفيد";
                  case HumanConsultStatus.ACCEPTED:
                    return "تم قبولك للمحادثة";
                  case HumanConsultStatus.IN_PROGRESS:
                    return "استشارة قيد التنفيذ";
                  case HumanConsultStatus.COMPLETED:
                    return "استشارة منجزة";
                  case HumanConsultStatus.CANCELED:
                    return "استشارة ملغاة";
                  default:
                    return req.status;
                }
              })();

              const statusColor = (() => {
                switch (req.status) {
                  case HumanConsultStatus.PENDING:
                    return "bg-amber-500/10 text-amber-300 border-amber-500/40";
                  case HumanConsultStatus.ACCEPTED:
                  case HumanConsultStatus.IN_PROGRESS:
                    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
                  case HumanConsultStatus.COMPLETED:
                    return "bg-blue-500/10 text-blue-300 border-blue-500/40";
                  case HumanConsultStatus.CANCELED:
                    return "bg-red-500/10 text-red-300 border-red-500/40";
                  default:
                    return "bg-zinc-700/20 text-zinc-200 border-zinc-600/40";
                }
              })();

              return (
                <article
                  key={req.id}
                  className="border border-zinc-800 rounded-2xl bg-zinc-900/70 p-4 space-y-3"
                >
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-zinc-400">
                        رقم الطلب:{" "}
                        <span className="font-mono">#{req.id}</span>
                      </div>
                      <h2 className="text-base font-semibold text-zinc-50">
                        {consultation?.title || "استشارة بدون عنوان"}
                      </h2>
                      <p className="text-xs text-zinc-300 whitespace-pre-line">
                        {consultation?.description}
                      </p>
                      <div className="text-xs text-zinc-400 mt-1">
                        المستفيد:{" "}
                        <span className="font-medium">
                          {client?.name || client?.email || "مستخدم مسجل"}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        تاريخ الطلب:{" "}
                        {new Date(req.createdAt).toLocaleString("ar-IQ")}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={
                          "inline-flex items-center px-2 py-1 rounded-full text-[11px] border " +
                          statusColor
                        }
                      >
                        {statusLabel}
                      </span>

                      {myOffer && (
                        <div className="text-[11px] text-emerald-200 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2 text-right">
                          <div className="font-semibold mb-0.5">
                            عرضك على هذه الاستشارة:
                          </div>
                          <div>
                            الأجرة: {myOffer.fee} {myOffer.currency}
                          </div>
                          <div>حالة العرض: {myOffer.status}</div>
                        </div>
                      )}

                      {chatRoomId ? (
                        <Link
                          href={`/chat/${chatRoomId}`}
                          className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          فتح غرفة المحادثة
                        </Link>
                      ) : (
                        <p className="text-[11px] text-zinc-500 max-w-[220px] text-right">
                          لا توجد غرفة محادثة بعد. إذا كانت حالة الطلب بانتظار
                          اختيار المستفيد، فسيتم إنشاء الغرفة بعد موافقته على
                          أحد العروض.
                        </p>
                      )}
                    </div>
                  </header>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

