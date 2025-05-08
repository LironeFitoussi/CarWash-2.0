import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
  const error = useRouteError();
  let title = 'Something went wrong';
  let description = 'An unexpected error occurred. Please try again later.';
  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`;
    description = error.statusText || description;
  } else if (error instanceof Error) {
    description = error.message;
  }


  console.log(error);
  return (
    <div className="flex flex-col min-h-[60vh] items-center justify-center py-20 bg-muted/50 animate-fade-in">
      <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="bg-primary/10 rounded-full p-4 mb-2">
            <AlertTriangle className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
          <CardDescription className="text-center text-base text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        {/* Full Error Message div*/}
        <CardContent className="flex flex-col items-center gap-4 mt-2">
            <pre className="text-sm text-muted-foreground">
                {/* More info about the error */}
                {JSON.stringify(error, null, 2)}
                
            </pre>
        </CardContent>
        
        <CardContent className="flex flex-col items-center gap-4 mt-2">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              Go Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
