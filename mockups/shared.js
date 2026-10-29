const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('[data-count]').forEach(countUp);if(e.target.matches('[data-count]'))countUp(e.target);io.unobserve(e.target)}}),{threshold:.2});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
function countUp(el){if(el.dataset.done)return;el.dataset.done=1;const to=+el.dataset.count,pre=el.dataset.pre||'',suf=el.dataset.suf||'',t0=performance.now(),dur=1400;
  const step=now=>{const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,4);el.textContent=pre+Math.round(to*e).toLocaleString()+suf;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
