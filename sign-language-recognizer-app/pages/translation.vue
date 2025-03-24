<template>
  <v-container class="py-12">
    <!-- Translation Section -->
    <v-row class="mb-12">
      <v-col cols="12">
        <h1 class="text-3xl font-bold mb-6 text-white">Translation</h1>
      </v-col>
      <v-col cols="12">
        <div class="translate-card rounded-lg">
          <v-row class="p-5">
            <!-- Webcam and upload Buttons -->
            <v-col cols="12" md="2" class="text-center">
              <v-btn 
                block 
                size="small" 
                color="black" 
                class="mb-4" 
                prepend-icon="mdi-webcam"
                @click="startWebcam"
              >
                Webcam
              </v-btn>
              <v-btn block size="small" color="black" class="mb-4" prepend-icon="mdi-upload" @click="triggerFileInput">
                 Upload Video
              </v-btn>
              <input type="file" ref="videoInput" accept="video/*" @change="handleVideoUpload" hidden />

              <v-btn block size="small" prepend-icon="mdi-flag-outline">
                Report Error
              </v-btn>
            </v-col>

            <!-- Translation Display (Webcam feeds) -->
            <v-col cols="12" md="10">
              <v-sheet height="480" class="bg-gray-100 d-flex align-center justify-center rounded-lg">
                <div class="video-container">
                  <!-- Live video feed -->
                  <video ref="video" autoplay playsinline class="video-feed hidden"></video>
                  <!-- Processed feed from server -->
                  <img ref="processedImg" class="processed-feed" />
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- Translation Log Section -->
    <v-row class="rounded-lg trans-log-card">
      <v-col cols="12">
        <h2 class="text-2xl font-semibold mb-4 text-white">Translation Log</h2>
        <v-card outlined>
          <v-sheet height="200" class="pa-4 overflow-auto">
            <v-list dense>
              <v-list-item v-for="(entry, index) in translationLog" :key="index">
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="text-gray-700">{{ entry.timestamp }}</span>
                    <span class="ml-4">{{ entry.text }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>

    <!-- Hidden canvas to capture frames -->
    <canvas ref="canvas" style="display:none;"></canvas>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'

const translationLog = ref([
  { timestamp: '', text: '' },
])

// Refs for webcam and canvas elements
const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const processedImg = ref<HTMLImageElement | null>(null)
let stream: MediaStream | null = null
let captureInterval: number | null = null

// Define the response type
interface ProcessedImageResponse {
  processed_image: string;
  labels: any;
}

const translationStartTime = ref<number | null>(null)
const videoInput = ref<HTMLInputElement | null>(null)


async function startWebcam() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    
    if (video.value) {
      video.value.srcObject = stream
    }

    if (!captureInterval) {
      translationStartTime.value = Date.now()
      captureInterval = window.setInterval(captureAndSendFrame, 200)
    }
  } catch (err) {
    console.error('Error accessing webcam:', err)
    alert('Could not access webcam. Check console or permissions.')
  }
}



async function captureAndSendFrame() {
  if (!stream || !video.value || !canvas.value || translationStartTime.value === null) return

  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight

  const ctx = canvas.value.getContext('2d')
  if (ctx) {
    ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
    const dataURL = canvas.value.toDataURL('image/png')

    try {
      const response = await $fetch<ProcessedImageResponse>('http://127.0.0.1:5000/process_frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataURL }),
      })

      if (response?.processed_image && processedImg.value) {
        processedImg.value.src = response.processed_image
      }

      if (response?.labels && response.labels.length > 0) {
        // Calculate elapsed time in seconds
        const elapsedTime = Math.floor((Date.now() - translationStartTime.value) / 1000)
        const formattedTime = new Date(elapsedTime * 1000).toISOString().substring(11, 19) // Format hh:mm:ss

        response.labels.forEach((label: any) => {
          translationLog.value.push({ timestamp: formattedTime, text: label })
        })
      }
    } catch (error) {
      console.error('Error sending frame to server:', error)
    }
  }
}


function triggerFileInput() {
  if (videoInput.value) {
    videoInput.value.click()
  }
}

async function handleVideoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('video', file)

  try {
    const response = await $fetch('http://127.0.0.1:5000/process_video', {
      method: 'POST',
      body: formData,
    })

    if (response.translations) {
      translationLog.value = response.translations
    }
  } catch (error) {
    console.error('Error processing video:', error)
  }
}


// Clean up when component unmounts
onBeforeUnmount(() => {
  if (captureInterval) {
    clearInterval(captureInterval)
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
.bg-gray-100 {
  background-color: #0c212fa4;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-700 {
  color: #374151;
}

.video-container {
  display: flex;
  gap: 20px;
  background-image: url('assets/feed-backdrop.png');
  background-position: center;
  background-color: #303a429a;
  background-size: 5rem, 5rem;
  
}

.video-feed,
.processed-feed {
  border: 2px solid #333;
  width: 640px;
  height: 480px;
  object-fit: cover;
}

.translate-card {
  background-image: linear-gradient(90deg,
      rgba(0, 65, 98, 0.4) 0%,
      rgba(55, 48, 36, 0.4) 50%,
      rgba(0, 64, 96, 0.4) 100%
  );
}

.trans-log-card{
  background-image: linear-gradient(90deg,
      rgba(0, 65, 98, 0.4) 0%,
      rgba(55, 48, 36, 0.4) 50%,
      rgba(0, 64, 96, 0.4) 100%
  );

}
</style>
