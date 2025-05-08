import { useUser } from "@/hooks/useUser";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Car, Sparkles, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProfileRoute() {
    const { t } = useTranslation();
    const { user, isLoading } = useUser();

    // Dummy data for cars
    const cars = [
        {
            manufacturer: "Toyota",
            model: "Corolla",
            year: "2020",
            license: "123-456-78",
        },
        {
            manufacturer: "Mazda",
            model: "3",
            year: "2018",
            license: "987-654-32",
        },
    ];

    // Dummy data for washes
    const washes = [
        {
            title: t('profile.washes.express', 'Express Wash'),
            date: "2024-06-01",
            status: "completed",
            car: "Toyota Corolla",
        },
        {
            title: t('profile.washes.premium', 'Premium Wash'),
            date: "2024-05-15",
            status: "pending",
            car: "Mazda 3",
        },
    ];

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-10">
            {/* Profile Card */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-8 mx-4">
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border">
                        <UserIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <CardTitle className="text-2xl font-bold">
                        {isLoading ? <Skeleton className="h-6 w-40" /> : `${user.firstName} ${user.lastName}`}
                    </CardTitle>
                    <CardDescription>
                        {isLoading ? <Skeleton className="h-4 w-32" /> : user.email}
                    </CardDescription>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{user.role || t('profile.user', 'User')}</Badge>
                    </div>
                    <div className="mt-2 text-muted-foreground text-sm">
                        {isLoading ? <Skeleton className="h-4 w-24" /> : user.phone || t('profile.noPhone', 'No phone')}
                    </div>
                    <div className="mt-1 text-muted-foreground text-sm">
                        {isLoading ? <Skeleton className="h-4 w-32" /> : user.address || t('profile.noAddress', 'No address')}
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <Button variant="outline">{t('profile.edit', 'Edit Profile')}</Button>
                </div>
            </Card>

            {/* My Cars Section */}
            <Card className="m-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Car className="text-primary" />
                        <CardTitle>{t('profile.cars.title', 'My Cars')}</CardTitle>
                    </div>
                    <CardDescription>{t('profile.cars.desc', 'Your registered vehicles')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className=" pb-4">
                        <div className="grid gap-4 pb-4">
                            {cars.map((car, idx) => (
                                <Card key={idx} className="flex items-center gap-4 p-4">
                                    <div className="flex-shrink-0">
                                        <Car className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">{car.manufacturer} {car.model}</div>
                                        <div className="text-sm text-muted-foreground">{t('profile.cars.year', 'Year')}: {car.year}</div>
                                        <div className="text-xs text-muted-foreground">{t('profile.cars.license', 'License')}: {car.license}</div>
                                    </div>
                                    <Badge variant="secondary">{t('profile.cars.primary', 'Primary')}</Badge>
                                </Card>
                            ))}
                        </div>
                        {/* Placeholder for future: Add Car button */}
                        <div className="mt-4 text-center">
                            <Button variant="outline" size="sm">{t('profile.cars.add', 'Add Car')}</Button>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* My Washes Section */}
            <Card className="m-6">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        <CardTitle>{t('profile.washes.title', 'My Washes')}</CardTitle>
                    </div>
                    <CardDescription>{t('profile.washes.desc', 'Your recent and upcoming washes')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className=" pb-4">
                        <div className="grid gap-4 pb-4">
                            {washes.map((wash, idx) => (
                                <Card key={idx} className="flex items-center gap-4 p-4">
                                    <div className="flex-shrink-0">
                                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">{wash.title}</div>
                                        <div className="text-sm text-muted-foreground">{t('profile.washes.car', 'Car')}: {wash.car}</div>
                                        <div className="text-xs text-muted-foreground">{t('profile.washes.date', 'Date')}: {wash.date}</div>
                                    </div>
                                    <Badge variant={wash.status === "completed" ? "secondary" : "outline"}>
                                        {t(`profile.washes.status.${wash.status}`, wash.status)}
                                    </Badge>
                                </Card>
                            ))}
                        </div>
                        {/* Placeholder for future: Add Wash button */}
                        <div className="mt-4 text-center">
                            <Button variant="outline" size="sm">{t('profile.washes.add', 'Book Wash')}</Button>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
