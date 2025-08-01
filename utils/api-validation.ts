// utils/api-validation.ts
import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

export class ValidationError extends Error {
    constructor(message: string, public statusCode: number = 400) {
        super(message);
        this.name = 'ValidationError';
    }
}

export type RouteParams = Record<string, string | string[]>;
export type RouteContext = { params: RouteParams };
export type APIRouteHandler = (request: NextRequest, context: RouteContext) => Promise<NextResponse>;

// Type plus flexible pour les handlers qui n'utilisent que des paramètres simples
type SimpleRouteHandler = (request: NextRequest, context?: RouteContext) => Promise<NextResponse>;

/**
 * Valide les paramètres d'URL avec un schéma Zod
 * Gère automatiquement les paramètres asynchrones de Next.js 13+
 */
export async function validateParams<T>(
    params: RouteParams | Promise<RouteParams>,
    schema: z.ZodSchema<T>
): Promise<T> {
    // Résoudre la Promise si nécessaire
    const resolvedParams = await Promise.resolve(params);

    const result = schema.safeParse(resolvedParams);
    if (!result.success) {
        const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(`Invalid parameters: ${errorMessages}`);
    }
    return result.data;
}

export function validateParamsSync<T>(params: RouteParams, schema: z.ZodSchema<T>): T {
    const result = schema.safeParse(params);
    if (!result.success) {
        const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(`Invalid parameters: ${errorMessages}`);
    }
    return result.data;
}

/**
 * Valide le body JSON d'une requête avec un schéma Zod
 */
export async function validateBody<T>(request: NextRequest, schema: z.ZodSchema<T>): Promise<T> {
    try {
        const body: unknown = await request.json();
        const result = schema.safeParse(body);

        if (!result.success) {
            const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
            throw new ValidationError(`Invalid body: ${errorMessages}`);
        }

        return result.data;
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        if (error instanceof SyntaxError) {
            throw new ValidationError('Invalid JSON in request body');
        }
        throw new ValidationError('Failed to parse request body');
    }
}

/**
 * Valide les query parameters avec un schéma Zod
 */
export function validateSearchParams<T>(searchParams: URLSearchParams, schema: z.ZodSchema<T>): T {
    const params = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(params);

    if (!result.success) {
        const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(`Invalid query parameters: ${errorMessages}`);
    }

    return result.data;
}

/**
 * Wrapper pour gérer les erreurs dans les routes API Next.js
 * Supporte à la fois les handlers avec et sans contexte
 */
export function withErrorHandling(handler: APIRouteHandler): APIRouteHandler;
export function withErrorHandling(handler: SimpleRouteHandler): SimpleRouteHandler;
export function withErrorHandling(handler: APIRouteHandler | SimpleRouteHandler) {
    return async (request: NextRequest, context?: RouteContext): Promise<NextResponse> => {
        try {
            return await handler(request, context as RouteContext);
        } catch (error) {
            console.error('API route error:', error);

            if (error instanceof ValidationError) {
                return NextResponse.json(
                    {error: error.message},
                    {status: error.statusCode}
                );
            }

            if (error instanceof Error) {
                return NextResponse.json(
                    {error: 'Internal server error'},
                    {status: 500}
                );
            }

            return NextResponse.json(
                {error: 'Unknown error occurred'},
                {status: 500}
            );
        }
    };
}

type ContextOnlyHandler = (context: RouteContext) => Promise<NextResponse>;

/**
 * Wrapper pour gérer les erreurs dans les routes API Next.js
 * Spécifiquement pour les handlers qui n'utilisent que le contexte
 */
export function withErrorHandlingContextOnly(handler: ContextOnlyHandler): APIRouteHandler {
    return async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
        try {
            return await handler(context);
        } catch (error) {
            console.error('API route error:', error);

            if (error instanceof ValidationError) {
                return NextResponse.json(
                    {error: error.message},
                    {status: error.statusCode}
                );
            }

            if (error instanceof Error) {
                return NextResponse.json(
                    {error: 'Internal server error'},
                    {status: 500}
                );
            }

            return NextResponse.json(
                {error: 'Unknown error occurred'},
                {status: 500}
            );
        }
    };
}

/**
 * Helper pour créer des réponses JSON avec typage
 */
export function createResponse<T>(data: T, status: number = 200): NextResponse {
    return NextResponse.json(data, {status});
}

/**
 * Helper pour créer des réponses d'erreur
 */
export function createErrorResponse(message: string, status: number = 400): NextResponse {
    return NextResponse.json({error: message}, {status});
}