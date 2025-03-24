import torch
from ultralytics import YOLO
import torch.quantization as quant
import cv2
import math

model = YOLO("yolo-Weights/yolov5m.pt")

torch_model = model.model

torch_model.train()

def prepare_for_qat(model):
    model.qconfig = quant.get_default_qconfig('fbgemm')
    torch.quantization.prepare_qat(model, inplace=True)
    return model

torch_model_qat = prepare_for_qat(torch_model)

results = model.train(
    data="final_words\data.yaml",
    epochs=40,
    imgsz=128,
    batch=16,
)

def convert_to_quantized(model):
    torch.quantization.convert(model, inplace=True)
    return model

quantized_model = convert_to_quantized(torch_model_qat)

torch.save(quantized_model.state_dict(), "yolov5_quantized_128p_8bit.pth")
print("Quantized model saved as yolov5_quantized.pth")
