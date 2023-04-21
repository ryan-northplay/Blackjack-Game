/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { vi } from "vitest";
import { act } from "react-dom/test-utils";
import { FormTempalate } from "./FormTemplate";
import { renderWithProviders } from "../../utils/test-utils";

const TESTING_ROUTE = "http://localhost:5678/api/register/";
const restServer = setupServer(
    rest.post(TESTING_ROUTE, (req, res, ctx) => {
        return res(ctx.delay(50), ctx.status(200));
    }),
);

beforeAll(() => restServer.listen());
beforeEach(() => restServer.resetHandlers());
afterAll(() => restServer.close());

describe("FormTemplate", () => {
    beforeEach(() => {
        renderWithProviders(<FormTempalate
            header="Testing"
            pathForRequest="/register/"
            shouldRepeatPassword={false}
        />);
    });
    describe("Displays properly based on props", () => {
        it("Displays proper header", () => {
            const formHeader = screen.getByRole("heading");
            expect(within(formHeader).getByText("Testing")).toBeInTheDocument();
        });
        it("Displays only two fields when repeating is not needed", () => {
            expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
            expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
            expect(screen.queryByPlaceholderText("Confirm password")).not.toBeInTheDocument();
        });
        it("Display confirm password field when repeating is set", () => {
        });
        describe("Handles form with confirm password set to true", () => {
            beforeEach(() => {
                cleanup();
                renderWithProviders(<FormTempalate
                    header=""
                    pathForRequest=""
                    shouldRepeatPassword={true}
                />);
            });
            it("displays secondary filed for password confirmation", () => {
                expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
            });
            it("Displays message when trying to submit with mismatching passwords", () => {
                fireEvent.input(screen.getByPlaceholderText("Username"), { target: { value: "Test" } });
                fireEvent.input(screen.getByPlaceholderText("Password"), { target: { value: "aa" } });
                fireEvent.input(screen.getByPlaceholderText("Confirm password"), { target: { value: "a" } });
                fireEvent.click(screen.getByText("Submit"));

                expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
            });
        });
    });
    describe("Handles form events properly", () => {
        beforeEach(async () => {
            vi.useFakeTimers();
            fireEvent.input(screen.getByPlaceholderText("Username"), { target: { value: "Test" } });
            fireEvent.input(screen.getByPlaceholderText("Password"), { target: { value: "a" } });
            return () => vi.useRealTimers();
        });
        it("displas loader after submit", async () => {
            await act(async () => {
                fireEvent.click(screen.getByText("Submit"));
            });
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });
        describe("handles successful request", () => {
            beforeEach(async () => {
                await act(async () => {
                    fireEvent.click(screen.getByText("Submit"));
                });
            });
            it("displays success img", async () => {
                expect(await screen.findByAltText("Success icon")).toBeInTheDocument();
            });
            it("should revert to submit text after time", async () => {
                const successIcon = await screen.findByAltText("Success icon");
                act(() => {
                    vi.advanceTimersByTime(15000);
                });
                expect(successIcon).not.toBeInTheDocument();
                expect(screen.getByText("Submit")).toBeInTheDocument();
            });
        });
        describe("handles unsuccessful request", () => {
            it("on server code 500 and /register/ route display username taken", async () => {
                restServer.use(
                    rest.post(TESTING_ROUTE, (req, res, ctx) => {
                        return res(ctx.status(500));
                    }),
                );
                fireEvent.click(screen.getByText("Submit"));
                expect(await screen.findByText("Username taken")).toBeInTheDocument();
            });
            it("on unknown error display failed message", async () => {
                restServer.use(
                    rest.post(TESTING_ROUTE, (req, res, ctx) => {
                        return res(ctx.status(1));
                    }),
                );
                fireEvent.click(screen.getByText("Submit"));
                expect(await screen.findByText("Request failed")).toBeInTheDocument();
            });
        });
    });
});
