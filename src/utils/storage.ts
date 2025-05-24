import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// 이미지 파일을 Storage에 업로드하고 다운로드 URL 반환
export async function uploadImage(file: File, folder: string = 'images'): Promise<string> {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
