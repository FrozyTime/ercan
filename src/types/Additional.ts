import CommandData from "./CommandData";
import { ErelaClient } from "erela.js";

export default interface Additional {
    cmdlist: CommandData[],
    music: ErelaClient
}