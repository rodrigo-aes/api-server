import chalk, { ChalkInstance } from "chalk"

/**
 * Log class to print out logs
 */
class Log {
  private static styles: Record<string, ChalkInstance> = {
    info: chalk.cyan,
    success: chalk.green,
    warning: chalk.yellow,
    danger: chalk.red,
    default: chalk.white,
  };

  /**
   * 
   * @param {string} message - The log message with color styles
   * 
   * @example
   * Log.out('#[info]text info - #[success]text success') 
   */
  static out(message: string): void {
    const parsedMessage = message.replace(
      /#\[(\w+)\](.+?)(?=#\[|$)/g,
      (_, color, text) => {
        const applyColor = Log.styles[color.toLowerCase()] || ((t: string) => t);
        return applyColor(text);
      }
    );

    process.stdout.write(parsedMessage);
  }
}

export default Log