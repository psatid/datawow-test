"use client";

import dayjs from "dayjs";
import { useGetHistory } from "../history-hooks";

export const HistoryPage = () => {
  const { data: history } = useGetHistory();

  const getActionTypeLabel = (type: string) => {
    switch (type) {
      case "reservation_created":
        return "Reserve";
      case "cancel":
        return "reservation_cancelled";
      default:
        return "Cancel";
    }
  };

  return (
    <table className="w-full border-collapse text-black">
      <thead>
        <tr>
          <th className="border border-black p-2 text-left">Date time</th>
          <th className="border border-black p-2 text-left">Username</th>
          <th className="border border-black p-2 text-left">Concert name</th>
          <th className="border border-black p-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {(history ?? []).map((item, index) => (
          <tr key={index}>
            <td className="border border-black p-2">
              {dayjs(item.date).format("DD/MM/YYYY HH:mm:ss")}
            </td>
            <td className="border border-black p-2">{item.userEmail}</td>
            <td className="border border-black p-2">{item.concertName}</td>
            <td className="border border-black p-2">
              {getActionTypeLabel(item.type)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
