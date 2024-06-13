/**
 * Utils class to draw
 */
export class DrawingUtils {
    
    /**
     * Draws a rectangle given the specified coordinates.
     * @param {*} ctx 
     * @param {*} x 
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     * @param {*} color 
     */
    static draw_rectangle(ctx, x, y, width, height, color)
    {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.stroke();
    }
    
    /**
     * Draws an arc given the specified coordinates.
     * @param {*} ctx 
     * @param {*} x 
     * @param {*} y 
     * @param {*} radius 
     * @param {*} start 
     * @param {*} end 
     * @param {*} color 
     */
    static draw_arc(ctx, x, y, radius, start, end, color)
    {
        ctx.beginPath();
        ctx.fillStyle= color;
        ctx.arc(x, y, radius, start, end);
        ctx.fill();
    }
    
    /**
     * Draws a line given the specified coordinates.
     * @param {*} ctx 
     * @param {*} x 
     * @param {*} y 
     * @param {*} dest_x 
     * @param {*} dest_y 
     * @param {*} width 
     * @param {*} color 
     */
    static draw_line(ctx, x, y, dest_x, dest_y, width, color)
    {
        ctx.beginPath();
        ctx.strokeStyle  = color;
        ctx.lineWidth = width;
        ctx.moveTo(x, y);
        ctx.lineTo(dest_x, dest_y);
        ctx.stroke();
    }
    
    /**
     * Draws text given the specified coordinates.
     * @param {*} ctx 
     * @param {*} content 
     * @param {*} x 
     * @param {*} y 
     * @param {*} font 
     * @param {*} style 
     * @param {*} align 
     */
    static draw_text(ctx, content, x, y, font, style, align)
    {
        ctx.font = font;
        ctx.fillStyle = style;
        ctx.textAlign = align;
        ctx.fillText(content, x, y);
    }
}