import {describe, it, expect, vi} from 'vitest';
import {render} from "../helpers/react-testing";
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button} from '@/components/ui/button';

describe('Button Component', () => {
    it('should render a button', () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole('button', {name: /click me/i});
        expect(button).toBeInTheDocument();
    });

    it('should handle click events', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button', {name: /click me/i});
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled button</Button>);

        const button = screen.getByRole('button', {name: /disabled button/i});
        expect(button).toBeDisabled();
    });

    it('should not call onClick when disabled', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(
            <Button disabled onClick={handleClick}>
                Disabled button
            </Button>,
        );

        const button = screen.getByRole('button', {name: /disabled button/i});
        await user.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('should render different variants', () => {
        const {rerender} = render(<Button variant="default">Default</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button variant="destructive">Destructive</Button>);
        expect(screen.getByRole('button', {name: /destructive/i})).toBeInTheDocument();

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button', {name: /outline/i})).toBeInTheDocument();

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole('button', {name: /ghost/i})).toBeInTheDocument();
    });

    it('should render different sizes', () => {
        const {rerender} = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button', {name: /large/i})).toBeInTheDocument();

        rerender(<Button size="icon">Icon</Button>);
        expect(screen.getByRole('button', {name: /icon/i})).toBeInTheDocument();
    });

    it('should have correct accessibility attributes', () => {
        render(<Button aria-label="Custom label">Button</Button>);

        const button = screen.getByRole('button', {name: /custom label/i});
        expect(button).toBeInTheDocument();
    });
});
