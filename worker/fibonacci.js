export default function fibonacci(index) {
    if (index < 2) {
        return 1;
    }
    return fibonacci(index - 1) + fibonacci(index - 2);
}
