// Función para convertir un buffer a string hexadecimal
export const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }