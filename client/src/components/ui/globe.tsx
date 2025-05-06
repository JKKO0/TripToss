"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// This is a simplified version of the globe component that doesn't rely on Three.js
// When we can install the correct dependencies, we can update this to use the full Three.js version

export interface GlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Globe({ className, ...props }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(0.002);
  const [manualRotation, setManualRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Globe radius
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMouseX(e.clientX);
      setLastMouseY(e.clientY);
      setRotationSpeed(0); // Stop auto-rotation when user interacts
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      
      setLastMouseX(e.clientX);
      setLastMouseY(e.clientY);
      
      // Update rotation based on mouse movement
      setManualRotation(prev => ({
        x: prev.x + deltaX * 0.005,
        y: prev.y + deltaY * 0.005
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
      // Resume auto-rotation after a short delay
      setTimeout(() => setRotationSpeed(0.002), 1000);
    };

    // Handle touch events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setLastMouseX(e.touches[0].clientX);
        setLastMouseY(e.touches[0].clientY);
        setRotationSpeed(0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - lastMouseX;
      const deltaY = e.touches[0].clientY - lastMouseY;
      
      setLastMouseX(e.touches[0].clientX);
      setLastMouseY(e.touches[0].clientY);
      
      setManualRotation(prev => ({
        x: prev.x + deltaX * 0.005,
        y: prev.y + deltaY * 0.005
      }));
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setTimeout(() => setRotationSpeed(0.002), 1000);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Function to animate globe
    let rotation = 0;
    let animationFrame: number;
    
    const animateGlobe = () => {
      if (!ctx) return;
      
      // Update rotation based on auto-rotation speed or manual control
      rotation += rotationSpeed;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient for "atmosphere"
      const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius * 1.2);
      gradient.addColorStop(0, 'rgba(24, 80, 180, 0)');
      gradient.addColorStop(1, 'rgba(24, 80, 180, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw globe
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      
      // Globe gradient
      const globeGradient = ctx.createRadialGradient(
        centerX - radius * 0.3, 
        centerY - radius * 0.3, 
        0, 
        centerX, 
        centerY, 
        radius
      );
      globeGradient.addColorStop(0, '#1a53a0');
      globeGradient.addColorStop(1, '#0c2c58');
      
      ctx.fillStyle = globeGradient;
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(100, 170, 255, 0.2)';
      ctx.lineWidth = 0.5;

      // Draw longitude lines
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + rotation + manualRotation.x;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Ensure radius is positive for second ellipse
        const radiusX = Math.abs(radius * Math.cos(angle));
        if (radiusX > 0) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radius, angle, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw latitude lines
      for (let i = 1; i < 6; i++) {
        const latRadius = radius * Math.sin((i / 6) * Math.PI / 2);
        const y = centerY - radius * Math.cos((i / 6) * Math.PI / 2);
        
        ctx.beginPath();
        ctx.arc(centerX, y, latRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY * 2 - y, latRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw data points
      const points = [
        { lat: 40, lng: -74, size: 2 }, // New York
        { lat: 51, lng: 0, size: 2 },   // London
        { lat: 35, lng: 139, size: 2 }, // Tokyo
        { lat: -33, lng: 151, size: 2 }, // Sydney
        { lat: 37, lng: -122, size: 2 }, // San Francisco
        { lat: 19, lng: 72, size: 2 }, // Mumbai
        { lat: -22, lng: -43, size: 2 }, // Rio
        { lat: 55, lng: 37, size: 2 }, // Moscow
      ];

      points.forEach(point => {
        // Convert lat/lng to canvas coordinates
        const phi = (90 - point.lat) * (Math.PI / 180);
        const theta = (point.lng + 180) * (Math.PI / 180) + rotation + manualRotation.x;
        
        const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
        const y = centerY - radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        // Only show points on the front half of the globe
        if (z < 0) {
          ctx.beginPath();
          ctx.arc(x, y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = '#1e79fa'; // Updated to match theme
          ctx.fill();
          
          // Add glow effect
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, point.size * 4);
          glowGradient.addColorStop(0, 'rgba(30, 121, 250, 0.6)'); // Updated to match theme
          glowGradient.addColorStop(1, 'rgba(30, 121, 250, 0)'); // Updated to match theme
          
          ctx.beginPath();
          ctx.arc(x, y, point.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }
      });

      // Draw arcs between points
      const arcs = [
        { start: points[0], end: points[1] }, // NY to London
        { start: points[1], end: points[2] }, // London to Tokyo
        { start: points[2], end: points[3] }, // Tokyo to Sydney
        { start: points[0], end: points[4] }, // NY to SF
        { start: points[5], end: points[1] }, // Mumbai to London
        { start: points[6], end: points[0] }, // Rio to NY
      ];

      arcs.forEach(arc => {
        // Start point
        const phi1 = (90 - arc.start.lat) * (Math.PI / 180);
        const theta1 = (arc.start.lng + 180) * (Math.PI / 180) + rotation + manualRotation.x;
        
        const x1 = centerX + radius * Math.sin(phi1) * Math.cos(theta1);
        const y1 = centerY - radius * Math.cos(phi1);
        const z1 = radius * Math.sin(phi1) * Math.sin(theta1);
        
        // End point
        const phi2 = (90 - arc.end.lat) * (Math.PI / 180);
        const theta2 = (arc.end.lng + 180) * (Math.PI / 180) + rotation + manualRotation.x;
        
        const x2 = centerX + radius * Math.sin(phi2) * Math.cos(theta2);
        const y2 = centerY - radius * Math.cos(phi2);
        const z2 = radius * Math.sin(phi2) * Math.sin(theta2);
        
        // Only draw if at least one end is visible
        if (z1 < 0 || z2 < 0) {
          // Create gradient for arc
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, 'rgba(30, 121, 250, 0.7)'); // Updated to match theme
          gradient.addColorStop(1, 'rgba(30, 121, 250, 0.1)'); // Updated to match theme
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          
          // Calculate control point for curve (simplified)
          const midX = (x1 + x2) / 2;
          const midY = ((y1 + y2) / 2) - radius * 0.2;
          
          ctx.quadraticCurveTo(midX, midY, x2, y2);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Apply manual rotation to next frame
      const actualRotation = rotation + manualRotation.x;
      
      // Request next animation frame
      animationFrame = requestAnimationFrame(animateGlobe);
    };

    // Initial call to start animation
    animateGlobe();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up animation frame
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isClient]);

  return (
    <div className={cn("relative aspect-square", className)} {...props}>
      <canvas 
        ref={canvasRef}
        className={cn(
          "w-full h-full rounded-full",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      />
    </div>
  );
}