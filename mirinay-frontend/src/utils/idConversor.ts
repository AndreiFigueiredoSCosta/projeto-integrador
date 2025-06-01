export default function idConversor(num: number = 0): string {
    return num.toString().padStart(6, '0');
}
