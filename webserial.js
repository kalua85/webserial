class SerialPortHandler {
    constructor(baudRate) {
        this.baudRate = baudRate;
        this.port = null;
        this.reader = null;
        this.writer = null;
    }

    // Request access to the serial port
    async requestPort() {
        try {
            // Request a port and open a connection
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: this.baudRate });
            console.log(`Connected to the serial port with baud rate: ${this.baudRate}`);
        } catch (error) {
            console.error("Error accessing the serial port:", error);
        }
    }

    // Close the serial port connection
    async closePort() {
        try {
            if (this.port && this.port.open) {
                await this.port.close();
                console.log("Serial port closed.");
            }
        } catch (error) {
            console.error("Error closing the serial port:", error);
        }
    }

    // Set up a reader to read data from the serial port
    async readData() {
        try {
            if (this.port && this.port.readable) {
                this.reader = this.port.readable.getReader();
                let decoder = new TextDecoder();
                console.log("Reading data from serial port...");
                
                while (true) {
                    const { value, done } = await this.reader.read();
                    if (done) {
                        console.log("Reader closed.");
                        break;
                    }
                    console.log("Received data:", decoder.decode(value));
                }
            }
        } catch (error) {
            console.error("Error reading from the serial port:", error);
        }
    }

    // Set up a writer to send data to the serial port
    async sendData(data) {
        try {
            if (this.port && this.port.writable) {
                this.writer = this.port.writable.getWriter();
                let encoder = new TextEncoder();
                const encodedData = encoder.encode(data);
                await this.writer.write(encodedData);
                console.log("Sent data:", data);
            }
        } catch (error) {
            console.error("Error sending data to the serial port:", error);
        }
    }
}
