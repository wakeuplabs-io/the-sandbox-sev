import { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { getWalletBalance } from "./wallet.service";

export const getWalletBalanceController = async (c: Context) => {
  try {
    const walletData = await getWalletBalance();
    return c.json(
      {
        success: true,
        data: walletData,
        message: "Wallet balance retrieved successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return c.json(
      {
        success: false,
        error: {
          code: "WALLET_BALANCE_FAILED",
          message: error instanceof Error ? error.message : "Failed to get wallet balance",
        },
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
