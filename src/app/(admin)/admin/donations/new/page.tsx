import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewDonationPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Global Donation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Donation create form with source medium and category fields will be added next.
            </CardContent>
        </Card>
    );
}
