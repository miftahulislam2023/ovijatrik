"use client";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MonthlyDonation = {
    label: string;
    amount: number;
};

type DonationTypeItem = {
    type: string;
    amount: number;
};

type WeeklyProgressItem = {
    title: string;
    target: number;
    current: number;
};

type TubewellByYearItem = {
    year: string;
    count: number;
};

const pieColors = ["#0E7490", "#0EA5E9", "#16A34A", "#F59E0B", "#DC2626", "#7C3AED"];

export function AdminOverviewCharts({
    monthlyDonations,
    donationTypeData,
    weeklyProgress,
    tubewellByYear,
}: {
    monthlyDonations: MonthlyDonation[];
    donationTypeData: DonationTypeItem[];
    weeklyProgress: WeeklyProgressItem[];
    tubewellByYear: TubewellByYearItem[];
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Donation Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyDonations}>
                            <defs>
                                <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => [`${value.toLocaleString()} BDT`, "Donation"]} />
                            <Area type="monotone" dataKey="amount" stroke="#0E7490" fill="url(#donationGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Donation Type Share</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={donationTypeData} dataKey="amount" nameKey="type" outerRadius={100}>
                                {donationTypeData.map((entry, index) => (
                                    <Cell key={entry.type} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value.toLocaleString()} BDT`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Project Progress</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyProgress}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="title" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={70} />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value.toLocaleString()} BDT`} />
                            <Legend />
                            <Bar dataKey="target" fill="#94A3B8" name="Target" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="current" fill="#0E7490" name="Collected" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tubewell Projects by Year</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tubewellByYear}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="year" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#16A34A" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
