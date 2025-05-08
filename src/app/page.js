// src/app/page.js
import { redirect } from 'next/navigation'
import {getHomePath} from "@/utils/getHomePath";

export default function Home({ searchParams }) {
  const { slug } = searchParams
  redirect(getHomePath(slug))
}
