package backend.utils;

import java.nio.ByteBuffer;
import java.nio.DoubleBuffer;
import java.util.List;

public class VectorUtils {

    // Chuyển từ List<Double> sang byte[] để lưu vào DB
    public static byte[] toBytes(List<Double> vector) {
        if (vector == null) return null;
        double[] doubleArray = vector.stream().mapToDouble(Double::doubleValue).toArray();
        ByteBuffer byteBuffer = ByteBuffer.allocate(doubleArray.length * 8);
        byteBuffer.asDoubleBuffer().put(doubleArray);
        return byteBuffer.array();
    }

    // Chuyển từ byte[] (từ DB) sang double[] để tính toán
    public static double[] fromBytes(byte[] bytes) {
        if (bytes == null) return null;
        DoubleBuffer doubleBuffer = ByteBuffer.wrap(bytes).asDoubleBuffer();
        double[] doubleArray = new double[doubleBuffer.remaining()];
        doubleBuffer.get(doubleArray);return doubleArray;
             }
             public static double cosineSimilarity(double[] v1, double[] v2) {
        if (v1 == null || v2 == null || v1.length != v2.length) return 0;
        double dot = 0, norm1 = 0, norm2 = 0;
        for (int i = 0; i < v1.length; i++) {
            dot += v1[i] * v2[i];
            norm1 += v1[i] * v1[i];
            norm2 += v2[i] * v2[i];
        }
        double denom = Math.sqrt(norm1) * Math.sqrt(norm2);
        return (denom == 0) ? 0 : dot / denom;
    }
}